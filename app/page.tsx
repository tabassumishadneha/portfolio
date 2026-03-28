import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main className="relative bg-background text-foreground">
      <Navbar />
      <Hero />
      <Contact />
    </main>
  );
}
