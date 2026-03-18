# OpenSkillTree

> The open-source standard for measuring human skills across every domain.

OpenSkillTree is a community-driven taxonomy of human skills — across athletics, professions, creative disciplines, and beyond. Every skill is broken into component parts, every level defined by quantitative benchmarks, every progression pathway made visible.

## Vision

We have taxonomies for every species, every element, every disease — but no equivalent for human ability. OpenSkillTree is building that map: a structured, open-source framework that answers the questions every serious practitioner eventually asks:

- *What does good look like?*
- *Where do I stand?*
- *How do I get to the next level?*

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

```
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

The core schema lives in [`types/skill-tree.ts`](./types/skill-tree.ts):

- **SkillTree** — a named collection of skills in a domain
- **SkillNode** — an individual skill with level benchmarks
- **SkillEdge** — a prerequisite relationship between nodes (DAG)
- **UserProgress** — user progress tracking (deferred from MVP V1)

See [`db/schema.sql`](./db/schema.sql) for the Postgres schema.

## Contributing

Contributions welcome — whether you're adding skill trees for your domain, improving the schema, or building the UI. See [MANIFESTO.md](./MANIFESTO.md) for the project's philosophy.

## License

MIT
