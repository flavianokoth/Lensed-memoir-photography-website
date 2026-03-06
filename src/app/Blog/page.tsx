"use client";
import { useMemo, useState, useEffect } from "react";
import Header from "../components/Header";
import { supabase } from "@/lib/supabase";

const isAdmin = false;

interface Blog {
  id: string;
  title: string;
  content: string;
  video_url?: string | null;
  created_at: string;
}

interface BlogComment {
  id: string;
  blog_id: string;
  parent_id: string | null;
  name: string;
  text: string;
  created_at: string;
}

const REACTION_EMOJIS = ["👍", "❤️", "😂", "🎉", "🔥", "👏"] as const;
const TEXT_EMOJIS = ["😀", "😁", "😂", "😍", "🥳", "🙏", "👍", "❤️", "🔥", "🎉"] as const;

function isYouTubeUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname.includes("youtube.com") || u.hostname === "youtu.be";
  } catch {
    return false;
  }
}

function toYouTubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "").trim();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

function countByEmoji(rows: { emoji: string }[] | null | undefined): Record<string, number> {
  const result: Record<string, number> = {};
  for (const r of rows ?? []) {
    result[r.emoji] = (result[r.emoji] ?? 0) + 1;
  }
  return result;
}

function buildCommentTree(comments: BlogComment[]) {
  const byId = new Map<string, BlogComment>();
  const children = new Map<string, BlogComment[]>();
  const roots: BlogComment[] = [];

  for (const c of comments) {
    byId.set(c.id, c);
    children.set(c.id, []);
  }
  for (const c of comments) {
    if (c.parent_id && byId.has(c.parent_id)) {
      children.get(c.parent_id)!.push(c);
    } else {
      roots.push(c);
    }
  }

  return { roots, children };
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  const [openBlogId, setOpenBlogId] = useState<string | null>(null);
  const [commentsByBlog, setCommentsByBlog] = useState<Record<string, BlogComment[]>>({});
  const [loadingComments, setLoadingComments] = useState(false);

  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyName, setReplyName] = useState("");
  const [replyText, setReplyText] = useState("");

  const [blogReactions, setBlogReactions] = useState<Record<string, Record<string, number>>>({});
  const [commentReactions, setCommentReactions] = useState<Record<string, Record<string, number>>>({});

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

        const blogIds = (data ?? []).map((b) => b.id);
        if (blogIds.length) {
          const { data: reactionRows, error: reactionErr } = await supabase
            .from("blog_reactions")
            .select("blog_id,emoji")
            .in("blog_id", blogIds);
          if (reactionErr) throw reactionErr;
          const grouped: Record<string, { emoji: string }[]> = {};
          for (const r of reactionRows ?? []) {
            grouped[r.blog_id] = grouped[r.blog_id] ?? [];
            grouped[r.blog_id].push({ emoji: r.emoji });
          }
          const counts: Record<string, Record<string, number>> = {};
          for (const id of blogIds) counts[id] = countByEmoji(grouped[id]);
          setBlogReactions(counts);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setBlogs([]);
      } finally {
        setLoadingBlogs(false);
      }
    };
    load();
  }, []);

  const loadComments = async (blogId: string) => {
    try {
      if (!supabase) throw new Error("Supabase is not configured. Missing env vars.");
      setLoadingComments(true);
      const { data, error } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("blog_id", blogId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      const comments = (data ?? []) as BlogComment[];
      setCommentsByBlog((prev) => ({ ...prev, [blogId]: comments }));

      const ids = comments.map((c) => c.id);
      if (ids.length) {
        const { data: reactRows, error: reactErr } = await supabase
          .from("comment_reactions")
          .select("comment_id,emoji")
          .in("comment_id", ids);
        if (reactErr) throw reactErr;
        const grouped: Record<string, { emoji: string }[]> = {};
        for (const r of reactRows ?? []) {
          grouped[r.comment_id] = grouped[r.comment_id] ?? [];
          grouped[r.comment_id].push({ emoji: r.emoji });
        }
        const counts: Record<string, Record<string, number>> = {};
        for (const id of ids) counts[id] = countByEmoji(grouped[id]);
        setCommentReactions((prev) => ({ ...prev, ...counts }));
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setCommentsByBlog((prev) => ({ ...prev, [blogId]: [] }));
    } finally {
      setLoadingComments(false);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    try {
      if (!supabase) {
        throw new Error("Supabase is not configured. Missing env vars.");
      }
      const { data, error } = await supabase
        .from("blogs")
        .insert({ title, content, video_url: videoUrl.trim() ? videoUrl.trim() : null })
        .select("*")
        .single();
      if (error) throw error;
      if (data) setBlogs([data, ...blogs]);
      setTitle("");
      setContent("");
      setVideoUrl("");
    } catch (err) {
      console.error("Error adding blog:", err);
    }
  };

  const submitComment = async (blogId: string) => {
    if (!commentName.trim() || !commentText.trim()) return;
    try {
      if (!supabase) throw new Error("Supabase is not configured. Missing env vars.");
      const { error } = await supabase.from("blog_comments").insert({
        blog_id: blogId,
        parent_id: null,
        name: commentName.trim(),
        text: commentText.trim(),
      });
      if (error) throw error;
      setCommentText("");
      setCommentName("");
      await loadComments(blogId);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const submitReply = async (blogId: string, parentId: string) => {
    if (!replyName.trim() || !replyText.trim()) return;
    try {
      if (!supabase) throw new Error("Supabase is not configured. Missing env vars.");
      const { error } = await supabase.from("blog_comments").insert({
        blog_id: blogId,
        parent_id: parentId,
        name: replyName.trim(),
        text: replyText.trim(),
      });
      if (error) throw error;
      setReplyText("");
      setReplyName("");
      setReplyingTo(null);
      await loadComments(blogId);
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  const reactToBlog = async (blogId: string, emoji: string) => {
    try {
      if (!supabase) throw new Error("Supabase is not configured. Missing env vars.");
      const { error } = await supabase.from("blog_reactions").insert({ blog_id: blogId, emoji });
      if (error) throw error;
      setBlogReactions((prev) => ({
        ...prev,
        [blogId]: { ...(prev[blogId] ?? {}), [emoji]: ((prev[blogId] ?? {})[emoji] ?? 0) + 1 },
      }));
    } catch (err) {
      console.error("Error reacting to blog:", err);
    }
  };

  const reactToComment = async (commentId: string, emoji: string) => {
    try {
      if (!supabase) throw new Error("Supabase is not configured. Missing env vars.");
      const { error } = await supabase.from("comment_reactions").insert({ comment_id: commentId, emoji });
      if (error) throw error;
      setCommentReactions((prev) => ({
        ...prev,
        [commentId]: {
          ...(prev[commentId] ?? {}),
          [emoji]: ((prev[commentId] ?? {})[emoji] ?? 0) + 1,
        },
      }));
    } catch (err) {
      console.error("Error reacting to comment:", err);
    }
  };

  const toggleComments = async (blogId: string) => {
    setOpenBlogId((prev) => (prev === blogId ? null : blogId));
    if (openBlogId !== blogId) {
      setReplyingTo(null);
      await loadComments(blogId);
    }
  };

  const currentComments = useMemo(() => {
    if (!openBlogId) return [];
    return commentsByBlog[openBlogId] ?? [];
  }, [commentsByBlog, openBlogId]);

  const commentTree = useMemo(() => buildCommentTree(currentComments), [currentComments]);

  return (
    <div>
      <Header />
      <section className="max-w-2xl mx-auto py-12 px-4 pt-32">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#05554F]">Community</h2>

        {isAdmin && (
          <form onSubmit={handleBlogSubmit} className="mb-8 space-y-4">
            <input
              type="text"
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              type="url"
              placeholder="Video URL (optional: YouTube or direct .mp4)"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            <textarea
              placeholder="Post content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              rows={5}
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-[#ff7b00] text-white font-semibold rounded hover:bg-[#ff9433] transition"
            >
              Publish
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
            <div key={blog.id} className="border-b pb-6">
              <h3 className="text-xl font-bold text-[#05554F]">{blog.title}</h3>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(blog.created_at).toLocaleDateString()}
              </p>

              {blog.video_url && (
                <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-black/5">
                  {isYouTubeUrl(blog.video_url) ? (
                    <iframe
                      className="w-full aspect-video"
                      src={toYouTubeEmbed(blog.video_url) ?? undefined}
                      title="Community video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video className="w-full" controls preload="metadata">
                      <source src={blog.video_url} />
                    </video>
                  )}
                </div>
              )}

              <p className="mt-3 text-gray-700 whitespace-pre-line">{blog.content}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                {REACTION_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => reactToBlog(blog.id, emoji)}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm hover:bg-gray-50 transition"
                    type="button"
                  >
                    <span>{emoji}</span>
                    <span className="text-gray-600">{(blogReactions[blog.id] ?? {})[emoji] ?? 0}</span>
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => toggleComments(blog.id)}
                  className="text-sm font-semibold text-[#ff7b00] underline"
                >
                  {openBlogId === blog.id ? "Hide comments" : "Show comments"}
                </button>

                {openBlogId === blog.id && (
                  <div className="mt-4 space-y-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                      <p className="font-semibold text-[#05554F] mb-3">Add a comment</p>
                      <div className="grid grid-cols-1 gap-2">
                        <input
                          className="w-full rounded border px-3 py-2"
                          placeholder="Your name"
                          value={commentName}
                          onChange={(e) => setCommentName(e.target.value)}
                        />
                        <textarea
                          className="w-full rounded border px-3 py-2"
                          placeholder="Write a comment..."
                          rows={3}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <div className="flex flex-wrap gap-2">
                          {TEXT_EMOJIS.map((em) => (
                            <button
                              key={em}
                              type="button"
                              className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 hover:bg-gray-100"
                              onClick={() => setCommentText((t) => `${t}${em}`)}
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => submitComment(blog.id)}
                            className="rounded-lg bg-[#05554F] px-4 py-2 text-white font-semibold hover:bg-[#057c73] transition"
                          >
                            Post comment
                          </button>
                          {loadingComments && (
                            <span className="text-sm text-gray-500">Loading…</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {commentTree.roots.length === 0 ? (
                      <p className="text-sm text-gray-500">No comments yet. Be the first.</p>
                    ) : (
                      <div className="space-y-3">
                        {commentTree.roots.map((c) => (
                          <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-4">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-[#05554F]">{c.name}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(c.created_at).toLocaleString()}
                              </p>
                            </div>
                            <p className="mt-2 text-gray-700 whitespace-pre-line">{c.text}</p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {REACTION_EMOJIS.map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => reactToComment(c.id, emoji)}
                                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm hover:bg-gray-50 transition"
                                >
                                  <span>{emoji}</span>
                                  <span className="text-gray-600">
                                    {(commentReactions[c.id] ?? {})[emoji] ?? 0}
                                  </span>
                                </button>
                              ))}
                              <button
                                type="button"
                                className="ml-auto text-sm text-[#05554F] underline"
                                onClick={() => setReplyingTo((prev) => (prev === c.id ? null : c.id))}
                              >
                                Reply
                              </button>
                            </div>

                            {replyingTo === c.id && (
                              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                                <p className="font-semibold text-sm text-[#05554F] mb-2">Reply</p>
                                <div className="grid grid-cols-1 gap-2">
                                  <input
                                    className="w-full rounded border px-3 py-2"
                                    placeholder="Your name"
                                    value={replyName}
                                    onChange={(e) => setReplyName(e.target.value)}
                                  />
                                  <textarea
                                    className="w-full rounded border px-3 py-2"
                                    placeholder="Write a reply..."
                                    rows={2}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                  />
                                  <div className="flex flex-wrap gap-2">
                                    {TEXT_EMOJIS.map((em) => (
                                      <button
                                        key={em}
                                        type="button"
                                        className="rounded-lg border border-gray-200 bg-white px-2 py-1 hover:bg-gray-100"
                                        onClick={() => setReplyText((t) => `${t}${em}`)}
                                      >
                                        {em}
                                      </button>
                                    ))}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <button
                                      type="button"
                                      onClick={() => submitReply(blog.id, c.id)}
                                      className="rounded-lg bg-[#ff7b00] px-4 py-2 text-white font-semibold hover:bg-[#ff9433] transition"
                                    >
                                      Post reply
                                    </button>
                                    <button
                                      type="button"
                                      className="text-sm text-gray-600 underline"
                                      onClick={() => setReplyingTo(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {(commentTree.children.get(c.id) ?? []).length > 0 && (
                              <div className="mt-4 space-y-3 pl-4 border-l border-gray-200">
                                {(commentTree.children.get(c.id) ?? []).map((r) => (
                                  <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-4">
                                    <div className="flex items-center justify-between">
                                      <p className="font-semibold text-[#05554F]">{r.name}</p>
                                      <p className="text-xs text-gray-400">
                                        {new Date(r.created_at).toLocaleString()}
                                      </p>
                                    </div>
                                    <p className="mt-2 text-gray-700 whitespace-pre-line">{r.text}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {REACTION_EMOJIS.map((emoji) => (
                                        <button
                                          key={emoji}
                                          type="button"
                                          onClick={() => reactToComment(r.id, emoji)}
                                          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm hover:bg-gray-50 transition"
                                        >
                                          <span>{emoji}</span>
                                          <span className="text-gray-600">
                                            {(commentReactions[r.id] ?? {})[emoji] ?? 0}
                                          </span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
    </div>
  );
}