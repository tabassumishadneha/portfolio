export default function Blog() {
  const posts = [
    {
      title: "How I Built My Portfolio",
      desc: "Step-by-step process of building my portfolio using Next.js and Tailwind.",
      date: "April 2026",
      read: "3 min read",
      tag: "Frontend",
      link: "#",
    },
    {
      title: "C++ vs JavaScript",
      desc: "My experience learning both languages as a CSE student.",
      date: "March 2026",
      read: "4 min read",
      tag: "Programming",
      link: "#",
    },
    {
      title: "My First Competitive Programming Journey",
      desc: "How I started solving problems and improving logic.",
      date: "February 2026",
      read: "5 min read",
      tag: "CP",
      link: "#",
    },
  ];

  return (
    <section className="p-10">
      <h2 className="text-3xl font-bold mb-8 text-center">Blog</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {/* Tag */}
            <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
              {post.tag}
            </span>

            {/* Title */}
            <h3 className="text-xl font-semibold mt-3 mb-2">
              {post.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {post.desc}
            </p>

            {/* Meta */}
            <p className="text-xs text-gray-500 mb-4">
              {post.date} • {post.read}
            </p>

            {/* Button */}
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              Read More →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
