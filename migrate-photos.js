import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/lensedMemoir");

const PhotoSchema = new mongoose.Schema({
  url: String,
  alt: String,
});

const Photo = mongoose.model("Photo", PhotoSchema);

// Gallery photos to migrate
const galleryPhotos = [
  { src: "gallery 1.jpg", alt: "Gallery Photo 1" },
  { src: "gallery 2.jpg", alt: "Gallery Photo 2" },
  { src: "gallery 3.jpg", alt: "Gallery Photo 3" },
  { src: "gallery 4.jpg", alt: "Gallery Photo 4" },
  { src: "gallery 5.jpg", alt: "Gallery Photo 5" },
  { src: "gallery 6.jpg", alt: "Gallery Photo 6" },
];

async function migratePhotos() {
  try {
    const publicDir = path.join(__dirname, "public");
    const uploadsDir = path.join(__dirname, "uploads");
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    console.log("Starting photo migration...\n");

    for (const photo of galleryPhotos) {
      const sourcePath = path.join(publicDir, photo.src);
      const targetPath = path.join(uploadsDir, photo.src);

      // Check if file exists in public folder
      if (fs.existsSync(sourcePath)) {
        // Copy file to uploads folder
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`✓ Copied ${photo.src} to uploads folder`);

        // Check if photo already exists in database
        const existingPhoto = await Photo.findOne({ url: `/uploads/${photo.src}` });
        
        if (!existingPhoto) {
          // Add to database
          const newPhoto = new Photo({
            url: `/uploads/${photo.src}`,
            alt: photo.alt,
          });
          await newPhoto.save();
          console.log(`✓ Added ${photo.src} to MongoDB`);
        } else {
          console.log(`⚠ ${photo.src} already exists in database, skipped`);
        }
      } else {
        console.log(`✗ File not found: ${photo.src}`);
      }
    }

    console.log("\n✅ Photo migration completed!");
    console.log("\nYou can now:");
    console.log("1. Access the admin panel at http://localhost:3000/admin");
    console.log("2. See all photos in the gallery section");
    console.log("3. Manage (add/delete) photos through the admin panel");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error migrating photos:", error);
    mongoose.connection.close();
    process.exit(1);
  }
}

migratePhotos();

