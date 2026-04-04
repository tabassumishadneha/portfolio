import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Contact } from "@/components/Contact";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";

export default function Home() {
  return (
    <main className="relative bg-background text-foreground">
      <Navbar />
      <Hero />
      <Projects />
      <Blog />
      <Contact />
    </main>
  );
}
