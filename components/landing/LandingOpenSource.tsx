const PRINCIPLES = [
  {
    title: "Open schema",
    description:
      "The data model for skill trees, nodes, edges, and benchmarks is fully documented and versioned. Build on it, extend it, or propose changes.",
  },
  {
    title: "Open data",
    description:
      "Every skill map in the library is publicly readable. No paywalls on the knowledge graph.",
  },
  {
    title: "Open roadmap",
    description:
      "Priorities are visible on GitHub. File an issue, propose a tree, or challenge the model.",
  },
];

export default function LandingOpenSource() {
  return (
    <section className="py-16 border-b border-zinc-100 dark:border-zinc-900">
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-16">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Open source
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-snug">
            Built in public. Everything is open.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            OpenSkillTree is not a company or a product. It is infrastructure. Contribute a skill
            map for your domain, sharpen benchmark criteria, propose structural changes, or fork
            the whole thing and build something new on top of it.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/nathanqyu/OpenSkillTree"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
            >
              View on GitHub
            </a>
          </div>
        </div>
        <div className="space-y-6">
          {PRINCIPLES.map((p) => (
            <div key={p.title}>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{p.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
