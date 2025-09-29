"use client";
import { useState } from "react";

const API = "http://localhost:4000/api";
const isAdmin = true; // Replace with real authentication in production

export default function AdminPage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  // Add photo
  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) return;
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("alt", alt);
    const res = await fetch(`${API}/photos`, {
      method: "POST",
      body: formData,
    });
    if (res.ok) setMessage("Photo uploaded!");
    else setMessage("Photo upload failed.");
    setPhoto(null);
    setAlt("");
  };

  // Add blog
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    const res = await fetch(`${API}/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) setMessage("Blog posted!");
    else setMessage("Blog post failed.");
    setTitle("");
    setContent("");
  };

  if (!isAdmin) return <p className="text-center mt-12">Access denied.</p>;

  return (
    <section className="max-w-xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#05554F]">Admin Dashboard</h2>
      {message && <p className="mb-4 text-center text-green-600">{message}</p>}

      {/* Photo upload */}
      <form onSubmit={handlePhotoSubmit} className="mb-8 space-y-4">
        <h3 className="text-xl font-semibold mb-2">Add Photo</h3>
        <input
          type="file"
          accept="image/*"
          onChange={e => setPhoto(e.target.files?.[0] || null)}
          className="w-full"
          required
        />
        <input
          type="text"
          placeholder="Alt text"
          value={alt}
          onChange={e => setAlt(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-[#ff7b00] text-white font-semibold rounded hover:bg-[#ff9433] transition"
        >
          Upload Photo
        </button>
      </form>

      {/* Blog post */}
      <form onSubmit={handleBlogSubmit} className="mb-8 space-y-4">
        <h3 className="text-xl font-semibold mb-2">Add Blog</h3>
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          rows={5}
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-[#05554F] text-white font-semibold rounded hover:bg-[#057c73] transition"
        >
          Post Blog
        </button>
      </form>
    </section>
  );
}