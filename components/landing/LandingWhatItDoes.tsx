const PILLARS = [
  {
    number: "01",
    title: "Structured Skill Maps",
    description:
      "Skills decomposed into subskills with explicit dependencies and scope boundaries. Not flat lists — directed graphs that reflect how competence actually builds over time.",
  },
  {
    number: "02",
    title: "Benchmark Criteria",
    description:
      "Concrete, observable criteria describing what competence looks like at each level. Grounded in practice rather than vague rubrics or arbitrary point thresholds.",
  },
  {
    number: "03",
    title: "Progression Pathways",
    description:
      "Clear sequences from foundational knowledge to advanced application. Dependencies surface what must come first — and make implicit learning order explicit.",
  },
];

export default function LandingWhatItDoes() {
  return (
    <section className="py-16 border-b border-zinc-100 dark:border-zinc-900">
      <p className="mb-10 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        What OpenSkillTree provides
      </p>
      <div className="grid gap-10 sm:grid-cols-3">
        {PILLARS.map((pillar) => (
          <div key={pillar.number}>
            <p className="mb-3 font-mono text-xs text-zinc-300 dark:text-zinc-700">
              {pillar.number}
            </p>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              {pillar.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
