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
});
const CommentSchema = new mongoose.Schema({
  blogId: mongoose.Schema.Types.ObjectId,
  name: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
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
    const photos = await Photo.find();
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch photos" });
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

// Serve uploaded images
app.use("/uploads", express.static(uploadsDir));

// Start server
app.listen(4000, () => console.log("✅ Server running at http://localhost:4000"));

app.get("/test", (req, res) => {
  res.json({ message: "It works!" });
});