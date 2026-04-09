import Link from "next/link";

export default function LandingHero({ treeCount }: { treeCount: number }) {
  return (
    <section className="pt-16 pb-20 border-b border-zinc-100 dark:border-zinc-900">
      <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Open Infrastructure
      </p>
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50 leading-tight">
        The representation layer for human skill progression.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
        Skills are complex. Most tools flatten them into checklists. OpenSkillTree maps skills as
        structured graphs — with subskills, dependencies, benchmark criteria, and progression
        pathways — so coaches, learners, and builders share a common language for development.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/discover"
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Discover Your Skills
        </Link>
        <a
          href="#explore"
          className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
        >
          Browse Skill Maps
        </a>
        <a
          href="https://github.com/nathanqyu/OpenSkillTree"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-500 dark:hover:border-zinc-600"
        >
          View on GitHub
        </a>
      </div>
      {treeCount > 0 && (
        <p className="mt-8 text-sm text-zinc-400 dark:text-zinc-600">
          {treeCount} skill map{treeCount !== 1 ? "s" : ""} available
        </p>
      )}
    </section>
  );
}
