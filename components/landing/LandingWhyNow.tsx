export default function LandingWhyNow() {
  return (
    <section className="py-16 border-b border-zinc-100 dark:border-zinc-900">
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-16">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Why now
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-snug">
            AI is reshaping learning. Skill data is not ready.
          </h2>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          <p>
            As AI tutors, coaching tools, and adaptive learning systems multiply, they all face the
            same problem: they need structured knowledge of what skills are, how they decompose, and
            what progress looks like. Most are rebuilding this independently, in isolation.
          </p>
          <p>
            OpenSkillTree is designed to be shared foundation — machine-readable, human-meaningful
            representations of skill knowledge that any system can build on. Open schema, open data,
            no lock-in.
          </p>
          <p>
            The goal is not a complete taxonomy of all human skill. It is the infrastructure and a
            credible starting set, with a format that domain experts can extend and improve over
            time.
          </p>
        </div>
      </div>
    </section>
  );
}
