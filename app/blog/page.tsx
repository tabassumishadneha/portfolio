"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  created_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        if (data) setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      <header className="w-full max-w-3xl px-8 py-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/30 hover:text-accent transition-colors duration-300 flex items-center space-x-2"
        >
          <ArrowLeft size={12} />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-xl font-serif font-black tracking-tighter">
          Blog
        </h1>
      </header>

      <main className="w-full max-w-3xl px-8 flex flex-col space-y-12 pb-24">
        {loading ? (
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/30 text-center py-20">
            Loading...
          </p>
        ) : posts.length === 0 ? (
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/30 text-center py-20">
            No posts found.
          </p>
        ) : (
          posts.map(post => (
            <article key={post.id} className="group cursor-pointer">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock size={12} className="text-accent" />
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-foreground/40">
                    {post.created_at ? new Date(post.created_at).toLocaleDateString() : "Draft"}
                  </span>
                </div>
                <h2 className="text-2xl font-serif font-black tracking-tighter mb-4 group-hover:text-accent transition-colors duration-300">
                  {post.title}
                </h2>
                <p className="text-sm font-sans text-foreground/70 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent group-hover:underline">
                  Read more
                </span>
              </Link>
            </article>
          ))
        )}
      </main>
    </div>
  );
}
