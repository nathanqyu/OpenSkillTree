const ENABLES = [
  {
    audience: "Coaches",
    description:
      "Anchor feedback to structured skill maps. Make progress legible to both coach and learner, grounded in shared criteria rather than expert intuition alone.",
  },
  {
    audience: "Learning platforms",
    description:
      "Build adaptive curricula that respect real skill dependencies. Surface prerequisite gaps before learners hit walls, based on explicit graph structure.",
  },
  {
    audience: "Assessors",
    description:
      "Evaluate progress against benchmark criteria rather than vague rubrics. Make assessment decisions explainable, consistent, and tied to defined competence levels.",
  },
  {
    audience: "Builders",
    description:
      "Query structured skill data to power intelligent recommendations, gap analysis, and skill-aware systems — without constructing the ontology from scratch.",
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
