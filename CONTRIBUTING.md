# Contributing to OpenSkillTree

Thanks for your interest in contributing.

OpenSkillTree is an open effort to make human skill progression more legible across domains. That means contributions can come in many forms: domain modeling, benchmark design, schema improvements, UX, tooling, documentation, and philosophical pushback.

## Ways to contribute

You can contribute by helping with:

- new skill trees in domains you know deeply
- better decomposition of existing skills
- benchmark definitions and progression criteria
- dependency modeling between subskills
- schema and data model improvements
- UI and developer tooling
- documentation and examples
- critique of assumptions, edge cases, and blind spots

## What makes a strong contribution

Strong contributions are usually:

- grounded in real domain knowledge
- clear about assumptions
- explicit about uncertainty
- practical enough to be useful
- structured so others can build on them

We are especially interested in contributions from people who have actually coached, practiced, taught, assessed, or researched a domain in depth.

## Contribution philosophy

OpenSkillTree is trying to model skill seriously without pretending every domain is fully objective.

That means contributors should aim for:

### Explicitness
Do not rely on “you just know it when you see it” if you can articulate the criteria.

### Humility
Many benchmark definitions are imperfect. State what you know and what remains fuzzy.

### Legibility
Prefer structures and descriptions that help learners and builders understand the domain.

### Interoperability
Think in ways that could generalize across domains where possible.

### Practical usefulness
A contribution is stronger when it helps someone reason about progression, not just classification.

## Guidelines for skill-tree contributions

When proposing or editing a skill tree, try to answer:

- What is the parent domain?
- What are the core subskills?
- Which subskills are prerequisites for others?
- What does progression look like?
- How would someone recognize beginner, intermediate, advanced, or expert performance?
- Which parts are measurable, and which require rubric-based judgment?
- Where are the major ambiguities or disagreements?

## Benchmarks and levels

Not every skill should be forced into a single numeric scale.

Benchmark definitions can include:

- quantitative thresholds
- qualitative rubrics
- behavioral indicators
- performance examples
- comparative judgments
- mixed evidence

Favor clarity over fake precision.

## Before opening a large contribution

For major changes, it helps to open an issue first and describe:

- the domain or area you want to contribute to
- your proposed structure
- key assumptions
- open questions or uncertainties

That makes it easier to align early and reduce rework.

## Code contributions

If you are contributing code:

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Run tests and checks
5. Open a pull request with a clear explanation of what changed and why

## Development

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Common scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | TypeScript type check |

## Pull request expectations

A good PR should make it easy to understand:

- what changed
- why it changed
- what assumptions it relies on
- what tradeoffs were made
- what follow-up questions remain

## Code of conduct

Please be thoughtful, constructive, and respectful.

Skill, mastery, and evaluation are topics where smart people may reasonably disagree. We want disagreement to improve the work, not derail it.

See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community expectations.
