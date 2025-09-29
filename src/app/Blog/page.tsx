"use client";
import { useState, useEffect } from "react";

const API = "http://localhost:4000/api";
const isAdmin = false;

interface Blog {
  _id: string;
  title: string;
  content: string;
}

interface Reply {
  _id?: string;
  name: string;
  text: string;
}

interface Comment {
  _id: string;
  name: string;
  text: string;
  replies?: Reply[];
  reactions?: { like?: number; love?: number; laugh?: number };
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  // Reply state
  const [replyText, setReplyText] = useState("");
  const [replyName, setReplyName] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/blogs`)
      .then(res => res.json())
      .then(setBlogs)
      .catch(err => console.error("Error fetching blogs:", err))
      .finally(() => setLoadingBlogs(false));
  }, []);

  const fetchComments = (blogId: string) => {
    fetch(`${API}/comments/${blogId}`)
      .then(res => res.json())
      .then(coms => setComments(prev => ({ ...prev, [blogId]: coms })))
      .catch(err => console.error("Error fetching comments:", err));
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    try {
      const res = await fetch(`${API}/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const newBlog = await res.json();
      setBlogs([newBlog, ...blogs]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error adding blog:", err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent, blogId: string) => {
    e.preventDefault();
    if (!commentText || !commentName) return;
    try {
      await fetch(`${API}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId, name: commentName, text: commentText }),
      });
      setCommentText("");
      setCommentName("");
      fetchComments(blogId);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Reply to a comment
  const handleReplySubmit = async (e: React.FormEvent, commentId: string, blogId: string) => {
    e.preventDefault();
    if (!replyText || !replyName) return;
    try {
      await fetch(`${API}/comments/${commentId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: replyName, text: replyText }),
      });
      setReplyText("");
      setReplyName("");
      setReplyingTo(null);
      fetchComments(blogId);
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  // React to a comment
  const handleReact = async (commentId: string, type: string, blogId: string) => {
    try {
      await fetch(`${API}/comments/${commentId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      fetchComments(blogId);
    } catch (err) {
      console.error("Error reacting to comment:", err);
    }
  };

  return (
    <section className="max-w-2xl mx-auto py-12 px-4">
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
            <div key={blog._id} className="border-b pb-4">
              <h3 className="text-xl font-bold text-[#05554F]">{blog.title}</h3>
              <p className="mt-2 text-gray-700 whitespace-pre-line">{blog.content}</p>
              <button
                className="mt-2 text-sm text-[#ff7b00] underline"
                onClick={() => {
                  setSelectedBlogId(blog._id === selectedBlogId ? null : blog._id);
                  fetchComments(blog._id);
                }}
              >
                {selectedBlogId === blog._id ? "Hide Comments" : "Show Comments"}
              </button>

              {selectedBlogId === blog._id && (
                <div className="mt-4">
                  <form
                    onSubmit={e => handleCommentSubmit(e, blog._id)}
                    className="mb-2 flex flex-col gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={commentName}
                      onChange={e => setCommentName(e.target.value)}
                      className="px-2 py-1 border rounded"
                      required
                    />
                    <textarea
                      placeholder="Your Comment"
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      className="px-2 py-1 border rounded"
                      rows={2}
                      required
                    />
                    <button
                      type="submit"
                      className="self-end px-4 py-1 bg-[#05554F] text-white rounded"
                    >
                      Add Comment
                    </button>
                  </form>
                  <div className="space-y-2">
                    {(comments[blog._id] || []).map(com => (
                      <div key={com._id} className="bg-gray-100 rounded p-2">
                        <span className="font-semibold">{com.name}:</span>{" "}
                        <span>{com.text}</span>
                        {/* Reactions */}
                        <div className="flex gap-2 mt-1">
                          <button onClick={() => handleReact(com._id, "like", blog._id)} className="text-blue-600">👍 {com.reactions?.like || 0}</button>
                          <button onClick={() => handleReact(com._id, "love", blog._id)} className="text-red-500">❤️ {com.reactions?.love || 0}</button>
                          <button onClick={() => handleReact(com._id, "laugh", blog._id)} className="text-yellow-500">😂 {com.reactions?.laugh || 0}</button>
                          <button onClick={() => setReplyingTo(com._id)} className="text-[#05554F] underline">Reply</button>
                        </div>
                        {/* Replies */}
                        {com.replies && com.replies.length > 0 && (
                          <div className="ml-4 mt-2 space-y-1">
                            {com.replies.map((rep, idx) => (
                              <div key={idx} className="bg-gray-50 rounded p-1 text-sm">
                                <span className="font-semibold">{rep.name}:</span> <span>{rep.text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Reply form */}
                        {replyingTo === com._id && (
                          <form
                            onSubmit={e => handleReplySubmit(e, com._id, blog._id)}
                            className="mt-2 flex flex-col gap-1"
                          >
                            <input
                              type="text"
                              placeholder="Your Name"
                              value={replyName}
                              onChange={e => setReplyName(e.target.value)}
                              className="px-2 py-1 border rounded"
                              required
                            />
                            <textarea
                              placeholder="Your Reply"
                              value={replyText}
                              onChange={e => setReplyText(e.target.value)}
                              className="px-2 py-1 border rounded"
                              rows={1}
                              required
                            />
                            <button
                              type="submit"
                              className="self-end px-3 py-1 bg-[#ff7b00] text-white rounded"
                            >
                              Reply
                            </button>
                          </form>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}