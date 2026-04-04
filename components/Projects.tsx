export default function Projects() {
  const projects = [
    {
      title: "Portfolio Website",
      desc: "Personal portfolio built with Next.js & Tailwind CSS.",
      tech: ["Next.js", "Tailwind"],
      live: "#",
      github: "#",
    },
    {
      title: "Blog Dashboard",
      desc: "Admin dashboard with add/edit/delete blog features.",
      tech: ["React", "Firebase"],
      live: "#",
      github: "#",
    },
    {
      title: "Guessing Game",
      desc: "Interactive JS game with dynamic UI.",
      tech: ["JavaScript"],
      live: "#",
      github: "#",
    },
  ];

  return (
    <section className="p-10">
      <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold mb-2">
              {project.title}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {project.desc}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((t, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <a
                href={project.live}
                className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Live
              </a>
              <a
                href={project.github}
                className="text-sm border px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                GitHub
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
