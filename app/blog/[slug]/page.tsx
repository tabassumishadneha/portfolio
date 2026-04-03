"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { slug } = use(params);

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("slug", slug)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        if (data) setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/30">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-serif font-black tracking-tighter">Post not found</h1>
        <Link href="/blog" className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      <header className="w-full max-w-3xl px-8 py-16 flex items-center justify-between">
        <Link
          href="/blog"
          className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/30 hover:text-accent transition-colors duration-300 flex items-center space-x-2"
        >
          <ArrowLeft size={12} />
          <span>Back to Blog</span>
        </Link>
      </header>

      <article className="w-full max-w-3xl px-8 flex flex-col pb-24">
        <div className="flex items-center space-x-2 mb-6">
          <Clock size={14} className="text-accent" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40">
            {post.created_at ? new Date(post.created_at).toLocaleDateString() : "Draft"}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tighter mb-12">
          {post.title}
        </h1>
        <div className="prose prose-invert prose-p:font-sans prose-p:text-foreground/80 prose-headings:font-serif prose-headings:tracking-tighter prose-a:text-accent hover:prose-a:text-accent/80 max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </div>
  );
}
