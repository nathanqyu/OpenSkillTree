export default function LandingWhyItMatters() {
  return (
    <section className="py-16 border-b border-zinc-100 dark:border-zinc-900">
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-16">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Why this matters
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-snug">
            Skill knowledge is scattered, informal, and locked up.
          </h2>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          <p>
            How skills develop lives inside coaches&rsquo; heads, PDF curricula, proprietary LMS
            rubrics, and informal tradition. It rarely travels between contexts — and almost never
            in a form that machines or other humans can meaningfully use.
          </p>
          <p>
            The result: learners get vague feedback, assessors rely on inconsistent rubrics, and
            builders reconstruct skill ontologies from scratch for every product. There is no shared
            infrastructure.
          </p>
          <p>
            OpenSkillTree is a bet that skill knowledge can be made explicit, structured, and
            open — without losing the nuance that makes it worth having.
          </p>
        </div>
      </div>
    </section>
  );
}
