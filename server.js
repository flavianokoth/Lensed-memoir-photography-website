import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (remove deprecated options)
mongoose.connect("mongodb://localhost:27017/lensedMemoir");

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Schemas
const PhotoSchema = new mongoose.Schema({
  url: String,
  alt: String,
});
const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  reactions: {
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    laugh: { type: Number, default: 0 },
  },
});
const ReplySchema = new mongoose.Schema(
  {
    name: String,
    text: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const CommentSchema = new mongoose.Schema({
  blogId: mongoose.Schema.Types.ObjectId,
  name: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
  replies: { type: [ReplySchema], default: [] },
  reactions: {
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    laugh: { type: Number, default: 0 },
  },
});

const Photo = mongoose.model("Photo", PhotoSchema);
const Blog = mongoose.model("Blog", BlogSchema);
const Comment = mongoose.model("Comment", CommentSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Photo upload endpoint
app.post("/api/photos", upload.single("photo"), async (req, res) => {
  try {
    const url = `/uploads/${req.file.filename}`;
    const photo = new Photo({ url, alt: req.body.alt || "" });
    await photo.save();
    res.json(photo);
  } catch (err) {
    res.status(500).json({ error: "Photo upload failed" });
  }
});

// Get all photos
app.get("/api/photos", async (req, res) => {
  try {
    const photos = await Photo.find().sort({ _id: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch photos" });
  }
});

// Delete a photo
app.delete("/api/photos/:id", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }
    
    // Delete the file from filesystem
    const filePath = path.join(__dirname, photo.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete from database
    await Photo.findByIdAndDelete(req.params.id);
    res.json({ message: "Photo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete photo" });
  }
});

// Add a blog post
app.post("/api/blogs", async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to add blog" });
  }
});

// Get all blogs
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// Delete a blog
app.delete("/api/blogs/:id", async (req, res) => {
  try {
    // Delete all comments associated with this blog
    await Comment.deleteMany({ blogId: req.params.id });
    
    // Delete the blog
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

// React to a blog post
app.post("/api/blogs/:id/react", async (req, res) => {
  try {
    const { type } = req.body;
    const allowed = ["like", "love", "laugh"];

    if (!allowed.includes(type)) {
      return res.status(400).json({ error: "Invalid reaction type" });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { [`reactions.${type}`]: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to add reaction" });
  }
});

// Add a comment to a blog
app.post("/api/comments", async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Get comments for a blog
app.get("/api/comments/:blogId", async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

app.post("/api/comments/:commentId/reply", async (req, res) => {
  try {
    const { name, text } = req.body;
    if (!name || !text) {
      return res.status(400).json({ error: "Name and text are required" });
    }

    const comment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        $push: { replies: { name, text } },
      },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to add reply" });
  }
});

app.post("/api/comments/:commentId/react", async (req, res) => {
  try {
    const { type } = req.body;
    const allowed = ["like", "love", "laugh"];

    if (!allowed.includes(type)) {
      return res.status(400).json({ error: "Invalid reaction type" });
    }

    const comment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { $inc: { [`reactions.${type}`]: 1 } },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to add reaction" });
  }
});

// Serve uploaded images
app.use("/uploads", express.static(uploadsDir));

// Start server
app.listen(4000, () => console.log("✅ Server running at http://localhost:4000"));

app.get("/test", (req, res) => {
  res.json({ message: "It works!" });
});