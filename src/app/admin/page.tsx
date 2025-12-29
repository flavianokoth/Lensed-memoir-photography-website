"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../components/Header";

const API = "http://localhost:4000/api";
const isAdmin = true; // Replace with real authentication in production

interface Photo {
  _id: string;
  url: string;
  alt: string;
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function AdminPage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    fetchPhotos();
    fetchBlogs();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoadingPhotos(true);
      setServerError(false);
      const res = await fetch(`${API}/photos`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setPhotos(data);
      setServerError(false);
    } catch (err) {
      console.error("Error fetching photos:", err);
      setServerError(true);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoadingBlogs(true);
      const res = await fetch(`${API}/blogs`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setBlogs(data);
      setServerError(false);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setServerError(true);
    } finally {
      setLoadingBlogs(false);
    }
  };

  // Add photo
  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) return;
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("alt", alt);
    try {
      const res = await fetch(`${API}/photos`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setMessage("Photo uploaded!");
        setPhoto(null);
        setAlt("");
        fetchPhotos();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Photo upload failed.");
      }
    } catch (err) {
      setMessage("Photo upload failed.");
    }
  };

  // Delete photo
  const handleDeletePhoto = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    try {
      const res = await fetch(`${API}/photos/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("Photo deleted!");
        fetchPhotos();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Photo deletion failed.");
      }
    } catch (err) {
      setMessage("Photo deletion failed.");
    }
  };

  // Add blog
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    try {
      const res = await fetch(`${API}/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        setMessage("Blog posted!");
        setTitle("");
        setContent("");
        fetchBlogs();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Blog post failed.");
      }
    } catch (err) {
      setMessage("Blog post failed.");
    }
  };

  // Delete blog
  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post? All comments will also be deleted.")) return;
    try {
      const res = await fetch(`${API}/blogs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("Blog deleted!");
        fetchBlogs();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Blog deletion failed.");
      }
    } catch (err) {
      setMessage("Blog deletion failed.");
    }
  };

  if (!isAdmin) return <p className="text-center mt-12">Access denied.</p>;

  return (
    <div>
      <Header />
      <section className="max-w-6xl mx-auto py-12 px-4 pt-32">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#05554F]">Admin Dashboard</h2>
        
        {serverError && (
          <div className="mb-6 p-6 rounded-lg bg-red-50 border-2 border-red-300 text-red-800">
            <h3 className="font-bold text-lg mb-3">⚠️ Backend Server Not Running</h3>
            <p className="mb-3">The admin panel requires the backend server to be running.</p>
            <div className="bg-white p-4 rounded border border-red-200">
              <p className="font-semibold mb-2">To fix this, follow these steps:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Open a <strong>new terminal window</strong> in your project folder</li>
                <li>Run this command: <code className="bg-gray-100 px-2 py-1 rounded font-mono">node server.js</code></li>
                <li>Wait until you see: <code className="bg-gray-100 px-2 py-1 rounded font-mono">✅ Server running at http://localhost:4000</code></li>
                <li>Make sure MongoDB is running (if using local MongoDB)</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </div>
        )}
        
        {message && !serverError && (
          <div className={`mb-4 p-4 rounded-lg text-center ${
            message.includes("⚠️") || message.includes("failed") || message.includes("Cannot") || message.includes("error")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}>
            <p className="font-semibold">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Add Forms */}
          <div className="space-y-8">
            {/* Photo upload */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-[#05554F]">Add Photo</h3>
              <form onSubmit={handlePhotoSubmit} className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setPhoto(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Alt text (optional)"
                  value={alt}
                  onChange={e => setAlt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-[#ff7b00] text-white font-semibold rounded hover:bg-[#ff9433] transition"
                >
                  Upload Photo
                </button>
              </form>
            </div>

            {/* Blog post */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-[#05554F]">Add Blog Post</h3>
              <form onSubmit={handleBlogSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Blog Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <textarea
                  placeholder="Blog Content"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={5}
                  required
                />
                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-[#05554F] text-white font-semibold rounded hover:bg-[#057c73] transition"
                >
                  Post Blog
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Manage Items */}
          <div className="space-y-8">
            {/* Photo Gallery Management */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-[#05554F]">Manage Photos ({photos.length})</h3>
              {loadingPhotos ? (
                <p className="text-center text-gray-500">Loading photos...</p>
              ) : photos.length === 0 ? (
                <p className="text-center text-gray-500">No photos uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {photos.map((photo) => (
                    <div key={photo._id} className="relative group">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden">
                        <Image
                          src={photo.url.startsWith("http") ? photo.url : `http://localhost:4000${photo.url}`}
                          alt={photo.alt || "Gallery photo"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                      <button
                        onClick={() => handleDeletePhoto(photo._id)}
                        className="mt-2 w-full px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Blog Management */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-[#05554F]">Manage Blog Posts ({blogs.length})</h3>
              {loadingBlogs ? (
                <p className="text-center text-gray-500">Loading blogs...</p>
              ) : blogs.length === 0 ? (
                <p className="text-center text-gray-500">No blog posts yet.</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {blogs.map((blog) => (
                    <div key={blog._id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-[#05554F] mb-1">{blog.title}</h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{blog.content}</p>
                      <p className="text-xs text-gray-400 mb-2">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="px-4 py-1 bg-red-500 text-white text-sm font-semibold rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
