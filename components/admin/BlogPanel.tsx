"use client";

import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, X, Save } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  created_at: string;
}

export default function BlogPanel() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);

  const getStoredPassword = () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("admin_password") || "";
    }
    return "";
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost?.title || !currentPost?.slug || !currentPost?.content) return;

    const pass = getStoredPassword();

    try {
      const isUpdate = !!currentPost.id;
      const url = "/api/admin/blogs";
      
      const res = await fetch(url, {
        method: isUpdate ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": pass,
        },
        body: JSON.stringify(currentPost),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save post");
      }

      setIsEditing(false);
      setCurrentPost(null);
      fetchPosts();
    } catch (error: any) {
      console.error("Error saving post:", error);
      alert(`Error saving post: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    const pass = getStoredPassword();
    try {
      const res = await fetch("/api/admin/blogs", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": pass,
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post");
    }
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentPost({ title: "", slug: "", excerpt: "", content: "" });
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col h-full bg-background overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto w-full">
          <h2 className="text-xl font-serif font-black tracking-tighter">
            {currentPost?.id ? "Edit Post" : "New Post"}
          </h2>
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 hover:bg-foreground/5 rounded-lg transition-colors duration-300"
          >
            <X size={20} className="text-foreground/50" />
          </button>
        </div>

        <form onSubmit={handleSave} className="max-w-4xl mx-auto w-full space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/50">Title</label>
            <input
              type="text"
              required
              value={currentPost?.title || ""}
              onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
              className="w-full bg-foreground/[0.02] border border-foreground/5 rounded-xl px-4 py-3 text-sm font-sans text-foreground outline-none focus:border-accent/40"
              placeholder="Post title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/50">Slug</label>
            <input
              type="text"
              required
              value={currentPost?.slug || ""}
              onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
              className="w-full bg-foreground/[0.02] border border-foreground/5 rounded-xl px-4 py-3 text-sm font-sans text-foreground outline-none focus:border-accent/40"
              placeholder="url-friendly-slug"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/50">Excerpt</label>
            <textarea
              value={currentPost?.excerpt || ""}
              onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
              className="w-full bg-foreground/[0.02] border border-foreground/5 rounded-xl px-4 py-3 text-sm font-sans text-foreground outline-none focus:border-accent/40 min-h-[80px] resize-y"
              placeholder="Brief summary..."
            />
          </div>

          <div className="space-y-2 flex-1">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/50">Content (HTML allowed)</label>
            <textarea
              required
              value={currentPost?.content || ""}
              onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
              className="w-full bg-foreground/[0.02] border border-foreground/5 rounded-xl px-4 py-3 text-sm font-sans text-foreground outline-none focus:border-accent/40 min-h-[300px] resize-y font-mono"
              placeholder="<p>Write your post content here...</p>"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 bg-foreground text-background rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:scale-[1.02] transition-all duration-300"
            >
              <Save size={14} />
              <span>Save Post</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-serif font-black tracking-tighter">Blog Posts</h2>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-foreground text-background rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:scale-[1.02] transition-all duration-300"
        >
          <Plus size={14} />
          <span>New Post</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-sm text-foreground/50">Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-foreground/20">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold">No posts found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map(post => (
              <div key={post.id} className="flex items-center justify-between p-6 border border-foreground/5 rounded-xl hover:bg-foreground/[0.02] transition-colors duration-200">
                <div>
                  <h3 className="text-lg font-serif font-bold tracking-tighter mb-1">{post.title}</h3>
                  <div className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-bold">
                    <span>/{post.slug}</span>
                    <span>•</span>
                    <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Draft'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="p-2 hover:bg-foreground/5 rounded-lg transition-colors duration-300"
                    title="Edit"
                  >
                    <Edit2 size={16} className="text-foreground/50" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors duration-300"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-foreground/30 hover:text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
