"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, PenTool, Lock, ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";

// Sub-components
import MessagesPanel from "@/components/admin/MessagesPanel";
import BlogPanel from "@/components/admin/BlogPanel";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"messages" | "blog">("blog");

  useEffect(() => {
    // Check if password exists in sessionStorage
    const stored = sessionStorage.getItem("admin_password");
    if (stored) {
      verifyPassword(stored);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyPassword = async (pass: string) => {
    setLoading(true);
    // Use the messages route just to verify the password since it checks x-admin-password
    const res = await fetch("/api/admin/messages", {
      headers: { "x-admin-password": pass },
    });
    
    if (res.ok) {
      sessionStorage.setItem("admin_password", pass);
      setAuthenticated(true);
      setError("");
    } else {
      sessionStorage.removeItem("admin_password");
      setAuthenticated(false);
      setError("Invalid password");
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyPassword(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_password");
    setAuthenticated(false);
    setPassword("");
  };

  if (loading) {
    return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading...</div>;
  }

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 rounded-full bg-foreground/5 border border-foreground/5 flex items-center justify-center">
              <Lock size={18} className="text-foreground/40" />
            </div>
          </div>

          <h1 className="text-2xl font-serif font-black tracking-tighter text-center mb-2">
            Admin Panel
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/30 text-center mb-8">
            Enter password to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-foreground/[0.02] border border-foreground/5 rounded-xl px-5 py-4 text-sm font-sans text-foreground placeholder:text-foreground/20 outline-none focus:border-accent/40 transition-colors duration-300"
            />
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-foreground text-background rounded-full text-[9px] uppercase tracking-[0.2em] font-bold hover:scale-[1.02] transition-all duration-300"
            >
              Authenticate
            </button>
          </form>

          <Link
            href="/"
            className="flex items-center justify-center space-x-2 mt-6 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/30 hover:text-accent transition-colors duration-300"
          >
            <ArrowLeft size={12} />
            <span>Back to site</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar navigation */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-foreground/5 p-6 flex flex-col justify-between">
        <div>
          <div className="mb-12">
            <Link
              href="/"
              className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/30 hover:text-accent transition-colors duration-300 flex items-center space-x-2 mb-6"
            >
              <ArrowLeft size={12} />
              <span>Site</span>
            </Link>
            <h1 className="text-xl font-serif font-black tracking-tighter">
              Dashboard
            </h1>
          </div>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("blog")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-sans transition-colors duration-200 ${
                activeTab === "blog" ? "bg-foreground/5 font-bold" : "text-foreground/60 hover:bg-foreground/[0.02]"
              }`}
            >
              <PenTool size={16} className={activeTab === "blog" ? "text-accent" : ""} />
              <span>Blog Posts</span>
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-sans transition-colors duration-200 ${
                activeTab === "messages" ? "bg-foreground/5 font-bold" : "text-foreground/60 hover:bg-foreground/[0.02]"
              }`}
            >
              <Mail size={16} className={activeTab === "messages" ? "text-accent" : ""} />
              <span>Messages</span>
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-12 w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-sans text-red-400 hover:bg-red-500/10 transition-colors duration-200"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === "messages" ? <MessagesPanel /> : <BlogPanel />}
      </div>
    </div>
  );
}
