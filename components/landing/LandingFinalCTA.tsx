export default function LandingFinalCTA() {
  return (
    <section className="py-20">
      <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Get started
      </p>
      <h2 className="max-w-xl text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-snug">
        Skill progression deserves better infrastructure. Help build it.
      </h2>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
        Browse the existing skill maps, explore the schema, or contribute a tree for a domain you
        know well. The library grows with the community that builds it.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="#explore"
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Browse Skill Maps
        </a>
        <a
          href="https://github.com/nathanqyu/OpenSkillTree"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
        >
          Contribute on GitHub
        </a>
      </div>
    </section>
  );
}
