# OpenSkillTree

> An open standard for mapping, measuring, and progressing human skill.

OpenSkillTree is an open-source framework for representing human skill across any domain — athletics, creative disciplines, professions, communication, and beyond.

It starts from a simple belief:

If we want coaching, feedback, and personalized learning to become dramatically more accessible, we need a better way to define what skill actually is.

Today, every domain measures proficiency differently. Chess has Elo. Martial arts have belts. Music has grades. Many important real-world skills have no shared framework at all.

OpenSkillTree is an attempt to build that missing layer.

It provides a common language for:

- breaking skills into component parts
- defining progression from beginner to expert
- making benchmark levels explicit
- mapping prerequisite relationships between subskills
- helping people understand where they are and what to learn next

## Vision

The long-term vision is bigger than a taxonomy.

Imagine a future where systems can observe how a person performs in the real world — through video, wearables, sensors, software usage, or other contextual inputs — and turn that data into useful feedback.

To do that well, raw data is not enough.

We also need a structured model of skill itself:

- What does good look like?
- How should progress be measured?
- Which subskills matter most?
- What is someone ready to learn next?
- Where are they blocked?

OpenSkillTree is designed to be that layer: an open, extensible framework for modeling how human skill develops.

In that sense, OpenSkillTree is not just about classification. It is about making improvement legible.

## Why this matters

Great coaches already do this exceptionally well.

They observe, diagnose, prioritize, and guide. They know how to identify the next highest-leverage step for a learner based on where they are right now.

But that level of personalized feedback is still expensive, scarce, and inconsistent across domains.

If we want more people to benefit from high-quality coaching and personalized learning, we need better shared representations of:

- skill
- proficiency
- progression
- readiness
- excellence

OpenSkillTree is an early effort to help build that foundation in the open.

## What OpenSkillTree is today

Today, OpenSkillTree is a community-driven system for building skill trees across many domains.

Each skill tree is designed to make progression legible by defining:

- **domains** and **subdomains**
- **skill nodes**
- **benchmark levels of proficiency**
- **prerequisite relationships**
- **progression pathways**

The goal is not to claim perfect objectivity.

The goal is to create a framework that is useful, extensible, and rigorous enough to support learning, evaluation, coaching, and future skill-aware systems.

## Principles

OpenSkillTree is guided by a few core principles:

1. **Skills should be decomposable**  
   Complex abilities can usually be broken into smaller, trainable components.

2. **Progress should be legible**  
   Learners should be able to understand where they are, what “better” looks like, and what comes next.

3. **Benchmarks should be explicit**  
   Even when evaluation is imperfect, clearer criteria are better than vague intuition.

4. **The framework should be open**  
   Human skill should not be trapped inside fragmented curricula, opaque credentialing systems, or proprietary scoring systems.

5. **Different domains can share structure without losing nuance**  
   Tennis, writing, product management, and meditation may look different on the surface, but they still share common patterns of progression, dependency, and mastery.

## Current Scope

OpenSkillTree currently focuses on making skill progression visible.

That includes:

- defining skill trees across domains
- modeling dependencies between subskills
- describing benchmarked levels of proficiency
- creating a shared schema for future tools and applications

Over time, this foundation could support:

- skill assessment systems
- personalized coaching products
- adaptive learning platforms
- AI feedback and training tools
- benchmark and evaluation frameworks for human and AI performance

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Develop

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | TypeScript type check |

## Project Structure

```text
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable React components
│   └── ui/           # Low-level UI primitives
├── lib/              # Shared utilities and server helpers
├── types/            # TypeScript type definitions (canonical schema)
├── db/               # Database schema (Postgres)
├── docs/             # Architecture and design docs
└── agents/           # AI agent configuration
```

## Data Model

The core schema lives in [`types/skill-tree.ts`](./types/skill-tree.ts).

Core concepts:

- **SkillTree** — a named collection of skills within a domain
- **SkillNode** — an individual skill with benchmarked levels
- **SkillEdge** — a prerequisite relationship between nodes
- **UserProgress** — user progress tracking (deferred from MVP V1)

See [`db/schema.sql`](./db/schema.sql) for the Postgres schema.

## Why open source

This problem is too broad, too interdisciplinary, and too important to solve in a closed system.

OpenSkillTree is open source because building a useful standard for human skill will require input from:

- coaches
- educators
- domain experts
- researchers
- builders
- practitioners

If you care about coaching, learning, human performance, evaluation, knowledge representation, or benchmark design, contributions are welcome.

## Contributing

Contributions are welcome — whether you're:

- adding skill trees for a domain you know deeply
- refining benchmark definitions
- improving the schema and data model
- building the UI and developer tooling
- pressure-testing the philosophy and edge cases

See [MANIFESTO.md](./MANIFESTO.md) for the project's philosophy and [CONTRIBUTING.md](./CONTRIBUTING.md) for practical contribution guidelines.

## License

MIT
