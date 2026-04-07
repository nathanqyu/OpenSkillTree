# Contributing to OpenSkillTree

Community contributions are the growth engine of OpenSkillTree. Whether you're a domain expert contributing a skill tree or a developer improving the platform, this guide covers everything you need to get started.

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## Table of Contents

- [Development Setup](#development-setup)
- [Contributing Skill Trees](#contributing-skill-trees)
- [Contributing Code](#contributing-code)
- [Bug Reports & Feature Requests](#bug-reports--feature-requests)

---

## Development Setup

### Prerequisites

- **Node.js** 20+
- **pnpm** 9+ (`npm install -g pnpm`)
- **PostgreSQL** 15+ (local or Docker)

### Quick Start

```bash
# Clone the repo
git clone https://github.com/nathanqyu/OpenSkillTree.git
cd OpenSkillTree

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your PostgreSQL connection string:
#   DATABASE_URL=postgresql://user:password@localhost:5432/openskill_tree

# Create the database and run schema
psql -d openskill_tree -f db/schema.sql

# Ingest seed skill trees into the database
pnpm ingest

# Start the dev server
pnpm dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm test` | Run tests (Vitest) |
| `pnpm validate` | Validate all YAML skill trees against the schema |
| `pnpm ingest` | Ingest YAML files into the database |
| `pnpm ingest:force` | Re-ingest all trees (drops existing data first) |

---

## Contributing Skill Trees

### Who Should Contribute

You are the right contributor if you:

- Are a **domain expert**: a certified coach, practitioner, instructor, or professional with verifiable experience in a field
- Can ground skill benchmarks in **real frameworks, certifications, or measurable industry data** (not opinion or anecdote)
- Are willing to iterate on feedback from the review team

Examples of strong contributors: a USTA-certified tennis coach, a CISA-certified security professional, a PMP-certified project manager, a professional chef who teaches in an accredited program.

---

## Before You Start

Check the existing trees in `data/seeds/` to avoid duplication. If a tree for your domain already exists, consider opening an issue to discuss extending it rather than creating a new one.

---

## Fork + PR Workflow

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/OpenSkillTree.git
   cd OpenSkillTree
   ```
3. **Create a branch** for your skill tree:
   ```bash
   git checkout -b add/sports/tennis
   ```
4. **Create your YAML file** following the guide below.
5. **Validate** the file locally (see [Validation](#validation)).
6. **Commit and push**:
   ```bash
   git add data/seeds/<domain>/<tree-slug>.yaml
   git commit -m "feat: add sports/tennis skill tree"
   git push origin add/sports/tennis
   ```
7. **Open a Pull Request** against `main`. Fill in the PR template — include your credentials and the sources for each benchmark level.

---

## Naming Conventions

| What | Convention | Example |
|------|-----------|---------|
| File path | `data/seeds/{domain}/{tree-slug}.yaml` | `data/seeds/sports/tennis.yaml` |
| Domain folder | lowercase, single word | `sports`, `technology`, `business`, `creative-arts` |
| Tree slug | lowercase, hyphenated | `tennis`, `machine-learning`, `public-speaking` |
| Tree ID | `{domain}/{tree-slug}` | `"sports/tennis"` |
| Node ID | `{domain}/{tree-slug}/{node-slug}` | `"sports/tennis/serve"` |

---

## Step-by-Step: Creating a Skill Tree YAML

### Step 1 — Define the tree metadata

Every file starts with a comment header and a `tree` block:

```yaml
# OpenSkillTree — Seed Skill Tree: Tennis
#
# Domain:  Sports / Racket Sports / Tennis
# Author:  Your Name
# Version: 0.1.0
#
# Benchmark reference: <source, e.g. ITF Player Development framework>

tree:
  id: "sports/tennis"
  title: "Tennis"
  description: >
    A complete skill map for tennis — covering groundstrokes, serve, net play,
    footwork, and match strategy from beginner to competitive level.
  domain: "Sports"
  visibility: "public"
```

### Step 2 — Define skill nodes

Each `node` represents one discrete, teachable skill:

```yaml
nodes:
  - id: "sports/tennis/serve"
    title: "Serve"
    description: >
      The serve opens every point. A reliable serve creates immediate
      offensive pressure and is the single most important shot in tennis.
    benchmarks:
      - level: beginner
        criteria: "Gets serve in play consistently using a continental grip. Legal toss and swing path."
        metrics:
          - "60%+ first serve in rate"
      - level: intermediate
        criteria: "Directional placement — can target T, body, or wide on command. Consistent depth past the service line."
        metrics:
          - "75%+ first serve in rate"
          - "Hits intended target zone 6/10 serves"
      - level: advanced
        criteria: "Varied spin: flat, slice, and kick serve. Serve placement disrupts opponent positioning."
        metrics:
          - "85%+ first serve in rate"
          - "Executes 3 distinct serve types on command"
          - "Forces weak return on 3/10 serves"
      - level: expert
        criteria: "Serve as a strategic weapon. Disguises spin direction. Uses opponent tendencies to dictate serve patterns."
        metrics:
          - "88%+ first serve in rate under match pressure"
          - "Ace or unreturnable serve rate ≥ 8% at club/tournament level"
    tags: ["technical", "offensive", "measurable"]
```

Aim for **6–12 nodes** per tree. Each node should be independently learnable and meaningfully distinct from others.

### Step 3 — Define relationships

Relationships create the graph structure — they tell learners what to practice first:

```yaml
relationships:
  - source: "sports/tennis/footwork"
    target: "sports/tennis/serve"
    type: "enables"
    note: "Stable base and weight transfer are required for a reliable serve"

  - source: "sports/tennis/serve"
    target: "sports/tennis/return-of-serve"
    type: "complementary"
    note: "Understanding your own serve mechanics improves return reads"
```

**Relationship types:**

| Type | Meaning |
|------|---------|
| `requires` | Prerequisite — must be developed first |
| `enables` | Practicing this skill opens up the next one |
| `component-of` | Sub-skill that composes into a parent skill |
| `complementary` | Cross-skill benefit without a strict order |
| `variant-of` | Parallel skill at a similar level |

---

## How to Define Benchmarks

Every node must have **all four levels**: `beginner`, `intermediate`, `advanced`, `expert`.

**The cardinal rule: every level must have at least one number.**

If your domain has a recognized rating or certification scale (DUPR, ITF, IELTS, AWS certifications), anchor each level to it in the file's top comment and in `criteria`. If no scale exists, define a measurable threshold — a pass rate, count per session, error rate, or time.

| Level | Guideline |
|-------|-----------|
| `beginner` | Just started; can execute the skill with errors. Basic form established. |
| `intermediate` | Consistent execution in practice. Directional control. Applies skill in context. |
| `advanced` | Competitive performance. Executes under pressure. Multiple variations. |
| `expert` | Professional / elite level. Skill is a weapon, not just reliable. |

**What to put in `criteria`:** A qualitative description of what observable behavior looks like at this level. Written from the observer's point of view ("Player does X", not "You can do X").

**What to put in `metrics`:** One or more quantitative thresholds. Must reference a real standard or be measurable in a practice session. Examples:
- `"85%+ first serve in rate"` ✓
- `"Completes 10 reps at 75% of 1RM"` ✓
- `"Score of 7.0+ on IELTS Writing"` ✓
- `"Good at it"` ✗

**Sources required.** At minimum, each tree file must cite its benchmark sources in the top comment block. Acceptable sources: official certification bodies, national governing organizations, peer-reviewed literature, industry standard leveling frameworks (e.g., Reforge, CEFR, DUPR). Opinion-only benchmarks will be rejected in review.

---

## Full YAML Template

Copy this template and fill it in:

```yaml
# OpenSkillTree — Seed Skill Tree: <Title>
#
# Domain:  <Category> / <Subcategory> / <Skill>
# Author:  <Your Name>
# Version: 0.1.0
#
# Benchmark reference: <Source — e.g., "CEFR language levels", "AWS certification tiers">
#   beginner     ≈ <what this maps to in the reference framework>
#   intermediate ≈ <what this maps to>
#   advanced     ≈ <what this maps to>
#   expert       ≈ <what this maps to>

tree:
  id: "<domain>/<tree-slug>"
  title: "<Human-Readable Title>"
  description: >
    <2–4 sentence description of the skill domain. What does this tree cover?
    Who is it for? What does progression look like?>
  domain: "<Domain>"      # e.g., "Sports", "Technology", "Business", "Creative Arts"
  visibility: "public"

nodes:
  - id: "<domain>/<tree-slug>/<node-slug>"
    title: "<Skill Name>"
    description: >
      <1–3 sentence description. What is this skill? Why does it matter
      in the context of the broader domain?>
    benchmarks:
      - level: beginner
        criteria: "<Observable behavior at beginner level.>"
        metrics:
          - "<Quantitative threshold — e.g., '60%+ success rate'>"
        resources:
          - title: "<Resource title — be specific>"
            url: "<Working URL — must be publicly accessible>"
            type: "video"    # video | article | course | book | tool | exercise
          - title: "<Another resource>"
            url: "<URL>"
            type: "article"
        practice:
          - "<Time>: <Drill description — e.g., '10 min: Shadow footwork drill, 10 reps'>"
          - "<Time>: <Another drill>"
        projects:
          - "<Concrete deliverable — e.g., 'Build a calculator app using only vanilla JS'>"
        tips:
          - "<Common mistake to avoid — e.g., 'Don't skip the fundamentals'>"
      - level: intermediate
        criteria: "<Observable behavior at intermediate level.>"
        metrics:
          - "<Metric 1>"
          - "<Metric 2 (optional)>"
        resources:
          - title: "<Resource>"
            url: "<URL>"
            type: "video"
        practice:
          - "<Drill>"
        projects:
          - "<Project>"
        tips:
          - "<Tip>"
      - level: advanced
        criteria: "<Observable behavior at advanced level.>"
        metrics:
          - "<Metric 1>"
        resources:
          - title: "<Resource>"
            url: "<URL>"
            type: "article"
        practice:
          - "<Drill>"
        projects:
          - "<Project>"
        tips:
          - "<Tip>"
      - level: expert
        criteria: "<Observable behavior at expert level.>"
        metrics:
          - "<Metric — referenced to a real standard or competition context>"
        resources:
          - title: "<Resource>"
            url: "<URL>"
            type: "course"
        practice:
          - "<Drill>"
        projects:
          - "<Capstone project>"
        tips:
          - "<Expert-level insight>"
    tags: ["<tag1>", "<tag2>"]   # optional; searchable labels

  # Add 5–11 more nodes following the same pattern...

relationships:
  - source: "<domain>/<tree-slug>/<source-node>"
    target: "<domain>/<tree-slug>/<target-node>"
    type: "requires"    # requires | enables | component-of | complementary | variant-of
    note: "<One sentence explaining why this relationship exists.>"

  # Add more relationships...
```

---

## Example Walkthrough: Pickleball Tree

The pickleball tree (`data/seeds/sports/pickleball.yaml`) is the reference example. Here is what makes it good:

**Benchmark anchoring.** The top comment maps each level to the DUPR rating system (a real, widely-used pickleball rating). Reviewers and learners can immediately understand what each level means in context.

**Quantitative metrics at every level.** Even at `beginner`, the criteria include a number: `"70%+ serve in rate (7/10 serves land in)"`. This is the minimum bar — every level must have at least one measurable threshold.

**Node descriptions explain *why* the skill matters.** The Third Shot Drop node opens with: *"The third shot drop is the most important shot in pickleball."* This gives learners context for why they should prioritize this node.

**Relationships are typed and annotated.** Every edge has a `type` and a `note` explaining the reasoning. This isn't just a graph — it's documented pedagogy.

**Tags are used consistently.** Tags like `"measurable"`, `"foundation"`, `"advanced"` help the platform surface and filter content.

---

## Validation

Before submitting your PR, validate your YAML file against the JSON schema:

```bash
# Validate all skill trees
pnpm validate

# Validate a specific file
pnpm validate data/seeds/<domain>/<tree-slug>.yaml
```

The validator checks:
1. **YAML syntax** — valid indentation and structure
2. **Schema compliance** — all required fields present, correct types, valid enums
3. **Benchmark completeness** — all four levels (`beginner`, `intermediate`, `advanced`, `expert`) on every node
4. **Metrics requirement** — at least one metric per benchmark level
5. **ID format** — `domain/tree-slug/node-slug` naming convention
6. **Relationship integrity** — all `source`/`target` IDs reference existing nodes

You can also test ingestion locally:

```bash
pnpm ingest:force   # Re-ingests all trees into your local database
pnpm dev            # View your tree at http://localhost:3000
```

The formal JSON schema is at `schema/skill-tree.schema.json`.

---

## Review Process

After you open a PR, here is what to expect:

1. **Automated checks** run on your YAML (formatting, schema validity). Fix any failures before requesting review.
2. **A maintainer** will review the benchmark sources. Be prepared to link to or quote the source material for each level threshold.
3. **Domain review** (where applicable): for specialized technical domains we may request a second opinion from another domain expert.
4. **Feedback round**: most PRs go through 1–2 rounds of revision — typically to sharpen metrics, adjust level thresholds, or add missing relationships.
5. **Merge**: once approved, your tree is merged and published.

**Typical timeline:** 5–10 business days for initial feedback. Complex trees or unfamiliar domains may take longer.

---

## Quality Bar

PRs will be rejected if they:

- Use vague, non-measurable metrics ("good at it", "understands the concept")
- Lack source citations for benchmark levels
- Are missing any of the four benchmark levels on any node
- Use incorrect naming conventions (wrong path, uppercase slugs, etc.)
- Duplicate an existing tree without meaningful differentiation

PRs will be accepted if they:

- Ground every benchmark in a recognized standard, certification, or documented framework
- Include at least one quantitative metric per benchmark level
- Have 6–12 well-differentiated nodes
- Include relationships that accurately reflect the learning order in the domain
- Describe *observable* behavior, not internal mental states

---

---

## Contributing Code

Not a domain expert? You can still contribute by improving the platform itself.

### Architecture Overview

- **Next.js 16** app with App Router (`app/`)
- **PostgreSQL** database with full-text search (`db/schema.sql`)
- **YAML seed files** are the source of truth (`data/seeds/`)
- **React Flow + ELK.js** for graph visualization (`components/skill-tree/`)
- **TypeScript** throughout — types in `types/skill-tree.ts`
- **Vitest** for testing (`__tests__/`)

### Code PR Standards

1. **Branch naming**: `fix/description`, `feat/description`, or `refactor/description`
2. **TypeScript**: no `any` types — use the interfaces in `types/skill-tree.ts`
3. **Tests**: add tests for new features, update tests for changed behavior
4. **Formatting**: run `pnpm format` before committing — CI will reject unformatted code
5. **Type checking**: run `pnpm typecheck` — must pass cleanly
6. **Commit messages**: conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`)

### Good First Issues

Look for issues labeled `good-first-issue` on GitHub. Common areas for first contributions:

- Fixing broken resource URLs in skill trees
- Adding missing benchmark levels to nodes
- Improving accessibility (ARIA labels, keyboard navigation)
- Writing tests for untested components
- Documentation improvements

---

## Bug Reports & Feature Requests

### Bug Reports

Open a GitHub Issue with:

1. **What happened** — clear description of the bug
2. **Steps to reproduce** — numbered steps to trigger the issue
3. **Expected vs actual** — what should have happened vs what did happen
4. **Environment** — browser, OS, screen size if relevant
5. **Screenshots** — if it's a visual bug, include a screenshot

### Feature Requests

Open a GitHub Issue with:

1. **Problem** — what user need isn't being met?
2. **Proposed solution** — how do you think it should work?
3. **Alternatives considered** — what else could solve the problem?

Label your issue with `bug` or `feature-request` accordingly.

---

## Questions?

Open a GitHub Issue with the label `contribution-question` and a maintainer will respond.
