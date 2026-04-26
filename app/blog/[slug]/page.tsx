const posts: Record<string, { title: string; date: string; readTime: string; content: string }> = {
  "how-i-built-my-portfolio": {
    title: "How I Built My Portfolio",
    date: "April 2026",
    readTime: "3 min read",
    content: `I built this portfolio using Next.js 14 with the App Router and Tailwind CSS...
    
    Write your actual content here. Talk about: why you chose Next.js, how you set up the project,
    what challenges you faced, and what you learned. 3–5 paragraphs is enough.`,
  },
  "cpp-vs-javascript": {
    title: "C++ vs JavaScript",
    date: "March 2026",
    readTime: "4 min read",
    content: `As a CSE student learning both C++ and JavaScript, I noticed some interesting differences...`,
  },
  "competitive-programming": {
    title: "My First Competitive Programming Journey",
    date: "February 2026",
    readTime: "5 min read",
    content: `I started competitive programming to strengthen my problem-solving skills...`,
  },
};

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];
  if (!post) return <div className="min-h-screen flex items-center justify-center text-white">Post not found.</div>;

  return (
    <main className="min-h-screen bg-[#1a1a2e] text-white px-4 py-16">
      <article className="max-w-2xl mx-auto">
        <a href="/blog" className="text-cyan-400 text-sm mb-8 block hover:underline">← Back to Blog</a>
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-400 text-sm mb-10">{post.date} · {post.readTime}</p>
        <div className="text-gray-300 leading-relaxed whitespace-pre-line">{post.content}</div>
      </article>
    </main>
  );
}
