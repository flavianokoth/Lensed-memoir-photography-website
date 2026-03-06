"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import { supabase } from "@/lib/supabase";

const isAdmin = false;

interface Blog {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (!supabase) {
          throw new Error("Supabase is not configured. Missing env vars.");
        }
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setBlogs(data ?? []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setBlogs([]);
      } finally {
        setLoadingBlogs(false);
      }
    };
    load();
  }, []);

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    try {
      if (!supabase) {
        throw new Error("Supabase is not configured. Missing env vars.");
      }
      const { data, error } = await supabase
        .from("blogs")
        .insert({ title, content })
        .select("*")
        .single();
      if (error) throw error;
      if (data) setBlogs([data, ...blogs]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error adding blog:", err);
    }
  };

  return (
    <div>
      <Header />
      <section className="max-w-2xl mx-auto py-12 px-4 pt-32">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#05554F]">Blog</h2>

      {isAdmin && (
        <form onSubmit={handleBlogSubmit} className="mb-8 space-y-4">
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
            className="px-6 py-2 bg-[#ff7b00] text-white font-semibold rounded hover:bg-[#ff9433] transition"
          >
            Add Blog Post
          </button>
        </form>
      )}

      <div className="space-y-8">
        {loadingBlogs ? (
          <p className="text-center text-gray-500">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blog posts yet.</p>
        ) : (
          blogs.map(blog => (
            <div key={blog.id} className="border-b pb-4">
              <h3 className="text-xl font-bold text-[#05554F]">{blog.title}</h3>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(blog.created_at).toLocaleDateString()}
              </p>
              <p className="mt-2 text-gray-700 whitespace-pre-line">{blog.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
    </div>
  );
}