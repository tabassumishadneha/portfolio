"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, Sparkles } from "lucide-react";

export const Hero = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 pt-24 overflow-hidden bg-background">
      <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-foreground/5 rounded-full blur-[160px] pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-[1400px] w-full mx-auto z-10"
      >
        <motion.div
          variants={item}
          className="mb-8 inline-flex items-center space-x-3 px-4 py-2 rounded-full border border-foreground/5 bg-foreground/[0.02] backdrop-blur-sm"
        >
          <Sparkles size={14} className="text-accent" />
          <p className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-foreground/60">
            Student & Web Developer
          </p>
        </motion.div>

        <motion.div variants={item} className="relative mb-12">
          <h1 className="text-[18vw] md:text-[12vw] leading-[0.8] font-serif font-black tracking-tighter">
            TABASSUM <br />
            <span className="text-transparent webkit-text-stroke-1 webkit-text-stroke-foreground/20 italic font-light">
              NEHA
            </span>
          </h1>

          <div className="mt-8 md:mt-0 md:absolute md:bottom-12 md:right-0 max-w-sm">
            <p className="text-xl md:text-2xl font-serif italic font-light leading-tight text-foreground/80">
              “Life is hard, but so are you. <br />
              Keep going.” ✨
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="flex flex-col md:flex-row md:items-center justify-between gap-12 mt-16"
        >
          <div className="flex flex-wrap gap-3">
            {["Next.js", "React", "TypeScript", "Tailwind"].map((skill) => (
              <span
                key={skill}
                className="text-[9px] uppercase tracking-[0.2em] font-bold border border-foreground/5 bg-foreground/[0.01] px-5 py-3 rounded-full hover:bg-foreground hover:text-background transition-all duration-500 cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>

          <motion.div
            whileHover={{ x: 10 }}
            className="flex items-center space-x-6 group cursor-pointer"
          >
            <div className="text-[10px] uppercase tracking-[0.4em] font-black group-hover:text-accent transition-colors">
              VIEW PROJECTS
            </div>
            <div className="w-16 h-16 bg-foreground text-background rounded-full flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-500">
              <ArrowDownRight size={24} />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(#00000005_1px,transparent_1px)] [background-size:40px_40px] opacity-40 pointer-events-none" />
    </section>
  );
};
