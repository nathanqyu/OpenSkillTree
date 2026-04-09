const ENABLES = [
  {
    audience: "Coaches",
    description:
      "Anchor feedback to structured skill maps and benchmark criteria. Use evidence requirements to design assessments. Make progress legible to both coach and learner.",
  },
  {
    audience: "Learning platforms",
    description:
      "Build adaptive curricula that respect real skill dependencies. Use benchmark levels and evidence types to create structured assessment checkpoints, not just content sequences.",
  },
  {
    audience: "Assessors",
    description:
      "Evaluate progress against benchmark criteria with defined evidence types and signal quality. Make assessment decisions explainable, consistent, and honest about measurement limitations.",
  },
  {
    audience: "Builders",
    description:
      "Query structured skill data — including benchmark criteria, evidence requirements, and assessment methods — to power skill-aware systems without constructing the ontology from scratch.",
  },
];

export default function LandingWhatItEnables() {
  return (
    <section className="py-16 border-b border-zinc-100 dark:border-zinc-900">
      <p className="mb-10 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        What this enables
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {ENABLES.map((item) => (
          <div
            key={item.audience}
            className="rounded-xl border border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
          >
            <p className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {item.audience}
            </p>
            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
