"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowUpRight, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { y: 40, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const { error: insertError } = await supabase
      .from("contact_messages")
      .insert({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        message: formData.get("message") as string,
      });

    setLoading(false);

    if (insertError) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
    form.reset();
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 py-32 overflow-hidden bg-background"
    >
      {/* Atmosphere */}
      <div className="absolute bottom-[20%] left-[5%] w-[350px] h-[350px] bg-accent/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[15%] right-[8%] w-[250px] h-[250px] bg-foreground/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-[1400px] w-full mx-auto z-10"
      >
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <motion.p
              variants={item}
              className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-accent mb-6"
            >
              Get in Touch
            </motion.p>

            <motion.h2
              variants={item}
              className="text-[14vw] md:text-[7vw] leading-[0.85] font-serif font-black tracking-tighter"
            >
              LET'S <br />
              <span
                className="italic font-light text-transparent"
                style={{ WebkitTextStroke: "1.5px var(--accent)" }}
              >
                TALK
              </span>
            </motion.h2>

            <motion.p
              variants={item}
              className="mt-8 text-lg md:text-xl font-serif italic font-light leading-relaxed text-foreground/60 max-w-md"
            >
              Have a project in mind, or just want to say hello? I'd love to
              hear from you.
            </motion.p>

            {/* Contact details */}
            <motion.div variants={item} className="mt-12 space-y-4">
              <a
                href="mailto:hello@neha.dev"
                className="group flex items-center space-x-3"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 group-hover:text-accent transition-colors duration-300">
                  Email
                </span>
                <ArrowUpRight
                  size={12}
                  className="text-foreground/20 group-hover:text-accent transition-colors duration-300"
                />
              </a>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div variants={item} className="flex items-center">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  onSubmit={handleSubmit}
                  className="w-full space-y-6"
                >
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-foreground/40 block">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Your name"
                      className="w-full bg-foreground/[0.02] border border-foreground/5 rounded-xl px-5 py-4 text-sm font-sans text-foreground placeholder:text-foreground/20 outline-none focus:border-accent/40 transition-colors duration-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-foreground/40 block">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="your@email.com"
                      className="w-full bg-foreground/[0.02] border border-foreground/5 rounded-xl px-5 py-4 text-sm font-sans text-foreground placeholder:text-foreground/20 outline-none focus:border-accent/40 transition-colors duration-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-foreground/40 block">
                      Message
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell me about your project..."
                      className="w-full bg-foreground/[0.02] border border-foreground/5 rounded-xl px-5 py-4 text-sm font-sans text-foreground placeholder:text-foreground/20 outline-none focus:border-accent/40 transition-colors duration-300 resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-xs font-sans">{error}</p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={loading ? {} : { scale: 1.02 }}
                    whileTap={loading ? {} : { scale: 0.98 }}
                    className="group flex items-center space-x-4 mt-4 disabled:opacity-50"
                  >
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black group-hover:text-accent transition-colors duration-300">
                      {loading ? "Sending..." : "Send Message"}
                    </span>
                    <div className="w-14 h-14 bg-foreground text-background rounded-full flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-500">
                      {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Send size={18} />
                      )}
                    </div>
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex flex-col items-center text-center py-16"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-6">
                    <CheckCircle size={28} className="text-accent" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-serif font-black tracking-tighter mb-3">
                    Thank You
                  </h3>
                  <p className="text-sm text-foreground/50 font-sans max-w-xs">
                    Your message has been received. I'll get back to you soon.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-[9px] uppercase tracking-[0.2em] font-bold text-foreground/30 hover:text-accent transition-colors duration-300"
                  >
                    Send another
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      {/* Dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00000005_1px,transparent_1px)] [background-size:40px_40px] opacity-40 pointer-events-none" />
    </section>
  );
};
