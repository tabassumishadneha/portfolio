"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  CheckCircle,
  Circle,
  Trash2,
  Lock,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const getStoredPassword = () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("admin_password") || "";
    }
    return "";
  };

  const fetchMessages = useCallback(async (pass: string) => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/messages", {
      headers: { "x-admin-password": pass },
    });

    if (res.status === 401) {
      setAuthenticated(false);
      sessionStorage.removeItem("admin_password");
      setError("Invalid password");
      setLoading(false);
      return;
    }

    const data = await res.json();
    if (res.ok) {
      setMessages(data);
    } else {
      setError(data.error || "Failed to load messages");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const stored = getStoredPassword();
    if (stored) {
      setAuthenticated(true);
      fetchMessages(stored);
    }
  }, [fetchMessages]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("admin_password", password);
    setAuthenticated(true);
    await fetchMessages(password);
  };

  const toggleRead = async (id: string, read: boolean) => {
    const pass = getStoredPassword();
    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": pass,
      },
      body: JSON.stringify({ id, read: !read }),
    });
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: !read } : m))
    );
  };

  const deleteMessage = async (id: string) => {
    const pass = getStoredPassword();
    await fetch("/api/admin/messages", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": pass,
      },
      body: JSON.stringify({ id }),
    });
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected === id) setSelected(null);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = messages.filter((m) => !m.read).length;
  const selectedMessage = messages.find((m) => m.id === selected);

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
            {error && <p className="text-red-400 text-xs">{error}</p>}
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-foreground/5 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/30 hover:text-accent transition-colors duration-300 flex items-center space-x-2"
          >
            <ArrowLeft size={12} />
            <span>Site</span>
          </Link>
          <h1 className="text-lg font-serif font-black tracking-tighter">
            Messages
          </h1>
          {unreadCount > 0 && (
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <button
          onClick={() => fetchMessages(getStoredPassword())}
          className="p-2 hover:bg-foreground/5 rounded-lg transition-colors duration-300"
          title="Refresh"
        >
          <RefreshCw
            size={14}
            className={loading ? "animate-spin text-accent" : "text-foreground/30"}
          />
        </button>
      </div>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Message list */}
        <div className="w-full md:w-[400px] border-r border-foreground/5 overflow-y-auto">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-foreground/20">
              <Mail size={32} className="mb-3" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold">
                No messages yet
              </p>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => setSelected(msg.id)}
                className={`px-6 py-4 border-b border-foreground/5 cursor-pointer transition-colors duration-200 ${
                  selected === msg.id
                    ? "bg-foreground/[0.04]"
                    : "hover:bg-foreground/[0.02]"
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {msg.read ? (
                      <Circle size={8} className="text-foreground/10" />
                    ) : (
                      <Circle
                        size={8}
                        className="text-accent fill-accent"
                      />
                    )}
                    <span
                      className={`text-sm font-sans ${msg.read ? "font-medium text-foreground/50" : "font-bold"}`}
                    >
                      {msg.name}
                    </span>
                  </div>
                  <span className="text-[9px] text-foreground/25 font-sans whitespace-nowrap">
                    {formatDate(msg.created_at)}
                  </span>
                </div>
                <p className="text-[10px] text-foreground/30 font-sans ml-5 truncate">
                  {msg.email}
                </p>
                <p className="text-xs text-foreground/40 font-sans ml-5 mt-1 line-clamp-2">
                  {msg.message}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Message detail */}
        <div className="hidden md:flex flex-1 overflow-y-auto">
          {selectedMessage ? (
            <motion.div
              key={selectedMessage.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full p-8 max-w-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-serif font-black tracking-tighter">
                    {selectedMessage.name}
                  </h2>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-xs text-accent hover:underline font-sans"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      toggleRead(selectedMessage.id, selectedMessage.read)
                    }
                    className="p-2 hover:bg-foreground/5 rounded-lg transition-colors duration-300"
                    title={
                      selectedMessage.read ? "Mark as unread" : "Mark as read"
                    }
                  >
                    {selectedMessage.read ? (
                      <Circle size={16} className="text-foreground/30" />
                    ) : (
                      <CheckCircle size={16} className="text-accent" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors duration-300"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-foreground/30 hover:text-red-400" />
                  </button>
                </div>
              </div>

              <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-foreground/25 mb-4">
                {formatDate(selectedMessage.created_at)}
              </p>

              <p className="text-sm font-sans text-foreground/70 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full text-foreground/15">
              <Mail size={40} className="mb-3" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold">
                Select a message
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
