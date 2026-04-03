"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Work", href: "#work" },
    { name: "Philosophy", href: "#philosophy" },
    { name: "Blog", href: "/blog", isInternal: true },
    { name: "Connect", href: "#contact" },
  ];

  return (
    <div className="fixed top-6 left-0 w-full z-50 flex justify-center px-6">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`
          flex items-center justify-between w-full max-w-4xl px-6 py-3 rounded-full 
          border border-foreground/5 transition-all duration-500
          ${scrolled ? "bg-background/40 backdrop-blur-2xl shadow-xl shadow-black/5 py-4" : "bg-transparent"}
        `}
      >
        <div className="text-lg font-serif font-black tracking-tighter">
          T.E.N.
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            link.isInternal ? (
              <Link key={link.name} href={link.href} passHref legacyBehavior>
                <motion.a
                  className="text-[10px] uppercase tracking-[0.2em] font-sans font-medium hover:text-accent transition-colors duration-300"
                  whileHover={{ y: -1 }}
                >
                  {link.name}
                </motion.a>
              </Link>
            ) : (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-[10px] uppercase tracking-[0.2em] font-sans font-medium hover:text-accent transition-colors duration-300"
                whileHover={{ y: -1 }}
              >
                {link.name}
              </motion.a>
            )
          ))}
          <button className="px-5 py-2 bg-foreground text-background rounded-full text-[9px] uppercase tracking-[0.2em] font-bold hover:scale-105 transition-all duration-300">
            Let&apos;s Talk
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="p-2">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/95 backdrop-blur-3xl flex flex-col items-center justify-center space-y-8 z-[60] md:hidden"
        >
          {navLinks.map((link) => (
            link.isInternal ? (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-4xl font-serif tracking-tighter hover:italic transition-all"
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-4xl font-serif tracking-tighter hover:italic transition-all"
              >
                {link.name}
              </a>
            )
          ))}
          <X 
            size={32} 
            className="absolute top-10 right-10 cursor-pointer" 
            onClick={() => setIsOpen(false)} 
          />
        </motion.div>
      )}
    </div>
  );
};
