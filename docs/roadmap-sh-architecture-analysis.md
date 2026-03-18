# Roadmap.sh Architecture Analysis & Implications for OpenSkillTree

**Author:** VP of Engineering
**Date:** 2026-03-18
**Issue:** OPE-7

---

## Executive Summary

This document analyzes the open-source architecture of [roadmap.sh](https://github.com/kamranahmedse/developer-roadmap) (351k+ GitHub stars, 82 roadmaps, 1,486 contributors) to extract lessons for OpenSkillTree's skill graph data architecture. While roadmap.sh provides a proven model for community-driven learning paths in tech, its architecture is fundamentally a **visual flowchart editor** — not a **semantic skill graph**. OST requires a significantly different data model to serve its mission of universal skill taxonomy with quantitative benchmarks.

Key takeaway: **adopt roadmap.sh's community contribution model and content-decoupling pattern, but build a purpose-built semantic graph schema rather than inheriting its visual-layout-centric data format.**

---

## 1. Roadmap.sh Repository Structure

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Astro (static site) |
| Language | TypeScript (84.5%) |
| Styling | Tailwind CSS |
| Graph Renderer | React Flow (@xyflow) via `@roadmapsh/editor` |
| Package Manager | pnpm (monorepo) |
| Testing | Playwright |

### Directory Layout
```
src/
├── data/roadmaps/          # 82 roadmaps, each in its own directory
│   └── {roadmap-id}/
│       ├── {roadmap-id}.json    # React Flow graph definition (nodes + edges)
│       ├── {roadmap-id}.md      # Frontmatter metadata (SEO, dimensions, relations)
│       ├── content/             # Per-node markdown content files
│       │   └── {slug}@{nodeId}.md
│       ├── faqs.astro           # FAQ component
│       └── migration-mapping.json  # Old ID → new ID mapping for versioning
├── components/              # React/Astro UI components
├── lib/                     # Utility modules (roadmap.ts, resource-progress.ts, etc.)
├── stores/                  # Nanostores state management
└── queries/                 # API query types
```

---

## 2. How Skill Trees Are Defined

### 2.1 The Graph JSON (Core Data Model)

Each roadmap is defined as a React Flow diagram with two top-level arrays:

```json
{
  "nodes": [...],
  "edges": [...]
}
```

**Node schema:**
```typescript
interface Node {
  id: string;                    // nanoid (e.g., "pqBV7BMAs0z6qpfZeW2XP")
  type: 'topic' | 'subtopic' | 'todo' | 'section' | 'title' | 'label' |
        'button' | 'paragraph' | 'legend' | 'vertical' | 'horizontal';
  position: { x: number; y: number };  // absolute pixel position on canvas
  data: {
    label?: string;              // display text
    href?: string;               // for button nodes
    style?: {                    // inline visual styles
      fontSize?: number;
      textAlign?: string;
      backgroundColor?: string;
      stroke?: string;           // for connector lines
      strokeDasharray?: string;  // solid vs dashed
    };
    legend?: { id: string; color: string; label: string };
  };
  width?: number;
  height?: number;
  zIndex?: number;               // -999 for sections, 999 for content
}
```

**Edge schema:**
```typescript
interface Edge {
  id: string;
  source: string;              // source node ID
  sourceHandle: string;        // handle position (x1/x2, y1/y2, z1/z2, w1/w2)
  target: string;              // target node ID
  targetHandle: string;
  type: 'smoothstep';
  style: {
    stroke: string;
    strokeWidth: number;
    strokeDasharray: string;   // "0" = solid, "0.8 8" = dashed
  };
  data: { edgeStyle: 'solid' | 'dashed' };
}
```

**Critical observation:** The graph JSON is a **visual layout document**, not a semantic data model. Node positions are absolute pixel coordinates. Relationships are visual connectors, not typed semantic edges. There is no hierarchy — `parentId` does not exist. The only structure comes from visual grouping (section nodes as background rectangles) and edge connections.

### 2.2 Content Files (Decoupled from Graph)

Content lives in separate markdown files, one per interactive node:

```
content/{slugified-label}@{nodeId}.md
```

Example: `git-hooks@pqBV7BMAs0z6qpfZeW2XP.md`

Content structure:
```markdown
# Topic Title

Description paragraph(s) explaining the concept.

Visit the following resources to learn more:

- [@official@Official Docs Title](https://...)
- [@article@Tutorial Title](https://...)
- [@video@Video Title](https://youtube.com/...)
- [@opensource@Repo Name](https://github.com/...)
- [@course@Course Title](https://...)
```

Resource categorization uses inline `@type@` tags in link text — a clever but fragile convention parsed via regex (`/@([a-z.]+)@/`).

### 2.3 Roadmap Metadata (Frontmatter)

Each roadmap has a `.md` file with YAML frontmatter:

```yaml
renderer: 'editor'           # 'editor' (React Flow) or 'balsamiq' (legacy SVG)
jsonUrl: '/jsons/roadmaps/frontend.json'
order: 1
briefTitle: 'Frontend'
title: 'Frontend Developer'
hasTopics: true
dimensions: { width: 968, height: 2775 }
relatedRoadmaps: ['full-stack', 'javascript', 'react', ...]
seo: { title: '...', description: '...', keywords: [...] }
tags: ['roadmap', 'main-sitemap', 'role-roadmap']
```

---

## 3. Skill-to-Skill Mapping (Relationship Model)

### What Roadmap.sh Does

Roadmap.sh has a **flat relationship model**:

1. **Edges** — Visual connections between nodes on the same canvas. These represent "learn this before that" sequencing but carry no semantic type (prerequisite, composition, alternative, etc.). Solid edges suggest required order; dashed edges suggest optional/alternative paths.

2. **`relatedRoadmaps`** — A simple string array in frontmatter linking entire roadmaps to each other (e.g., Frontend → React, Vue, Angular). No relationship type or weight.

3. **`migration-mapping.json`** — Maps old node path strings (e.g., `"internet:dns-and-how-it-works"`) to new node IDs, enabling versioning when roadmaps are restructured. The colon-separated path notation implies a historical tree structure that the current data model no longer enforces.

### What's Missing for OST

| Capability | Roadmap.sh | OST Needs |
|-----------|-----------|-----------|
| Relationship types | None (just "connected") | prerequisite, component-of, variant-of, enables, complementary |
| Relationship direction | Visual only (top→down convention) | Explicit directed edges with semantic meaning |
| Cross-graph references | `relatedRoadmaps` (whole-roadmap level) | Node-level cross-graph edges (e.g., "CSS Flexbox" in Frontend → "Layout" skill in UI Design) |
| Hierarchy | Visual grouping via section nodes | Explicit parent-child composition (skill → sub-skills) |
| Relationship weight | None | Strength/importance of connection |
| Alternative paths | Dashed vs solid edges (visual convention) | Typed "alternative" relationships with equivalence metadata |

---

## 4. Metrics & Benchmarking

### What Roadmap.sh Does

Progress tracking is **binary self-assessment** with 5 states:

```typescript
type ResourceProgressType = 'done' | 'learning' | 'pending' | 'skipped' | 'removed';
```

Per-node tracking stores arrays of topic IDs in each state. UI shows completion percentage and count. There are no quantitative benchmarks, no skill levels, no assessment criteria — a user simply marks a topic as "done" based on their own judgment.

### What OST Needs (per the Manifesto)

The Manifesto states: *"Every level has a number."* This requires:

1. **Benchmark definitions per node** — Quantitative criteria for each proficiency level (e.g., "5k run time: beginner <35min, intermediate <25min, advanced <20min, elite <16min")
2. **Metric types** — Speed, accuracy, consistency, volume, complexity, quality (the Manifesto's categories)
3. **Assessment methodology** — How the benchmark is measured (self-report, automated test, coach assessment, competition result)
4. **Level system** — Ordinal proficiency levels with numeric thresholds
5. **Aggregation** — How sub-skill benchmarks roll up to parent skill scores

Roadmap.sh offers zero infrastructure for any of this. Its progress system is purely a completion tracker.

---

## 5. Architecture Recommendations for OST

### 5.1 Proposed Skill Graph Schema

Rather than inheriting roadmap.sh's visual-layout JSON, OST should define a **semantic skill graph** where structure is data, not pixel positions.

```yaml
# Example: skill node definition
id: "running/5k"
name: "5K Running"
domain: "athletics/endurance/distance-running"
parent: "running"
description: "Ability to complete a 5-kilometer run"

# Typed relationships
relationships:
  - target: "running/form"
    type: "requires"          # prerequisite
    weight: 0.8
  - target: "running/10k"
    type: "enables"           # this skill enables that skill
    weight: 0.6
  - target: "cycling/endurance"
    type: "complementary"     # cross-domain skill transfer
    weight: 0.3

# Quantitative benchmarks (the core OST differentiator)
benchmarks:
  metric: "time"
  unit: "minutes"
  assessment: "timed-race"
  levels:
    - level: 1
      name: "Beginner"
      threshold: 40
      direction: "lower-is-better"
    - level: 2
      name: "Intermediate"
      threshold: 28
    - level: 3
      name: "Advanced"
      threshold: 22
    - level: 4
      name: "Elite"
      threshold: 16
    - level: 5
      name: "World-Class"
      threshold: 13

# Contribution metadata
contributors:
  - id: "coach-jane"
    role: "domain-expert"
    verified: true
tags: ["cardio", "endurance", "measurable"]
```

### 5.2 Key Architectural Decisions

#### A. Separate structure from presentation

**Adopt from roadmap.sh:** The principle of decoupling content (markdown files) from graph structure (JSON).

**Improve for OST:** Go further — separate the **semantic graph** (skills, relationships, benchmarks) from **any visual layout**. Layout should be computed or defined separately, not baked into the skill data. This enables the same skill data to power CLI tools, APIs, mobile apps, and multiple visualization styles without carrying pixel positions.

```
ost/
├── skills/                    # Semantic skill definitions (YAML or JSON)
│   └── {domain}/
│       └── {skill-id}.yaml
├── content/                   # Rich descriptions, resources, guides
│   └── {skill-id}.md
├── benchmarks/                # Benchmark datasets (possibly separate for versioning)
│   └── {skill-id}.benchmarks.yaml
└── layouts/                   # Optional visual layout definitions (for specific UIs)
    └── {roadmap-id}.layout.json
```

#### B. Use YAML for human-authored skill definitions

Roadmap.sh uses JSON because it's generated by the React Flow editor. For OST, where the goal is community contribution, **YAML is more contributor-friendly** — easier to read, edit, and diff in PRs. JSON can be generated from YAML for APIs and applications.

#### C. Explicit typed relationships (not visual edges)

Define a fixed vocabulary of relationship types:

| Type | Meaning | Example |
|------|---------|---------|
| `requires` | Prerequisite | "5K Running" requires "Running Form" |
| `component-of` | Sub-skill composition | "Passing" is component-of "Basketball Offense" |
| `enables` | Opens up next skill | "Basic Algebra" enables "Calculus" |
| `variant-of` | Alternative approach | "Backstroke" is variant-of "Freestyle" (both "Swimming Strokes") |
| `complementary` | Cross-domain transfer | "Yoga Flexibility" is complementary to "Martial Arts" |
| `assessed-by` | Links to benchmark/metric | "5K Running" assessed-by "Timed 5K Race" |

#### D. Hierarchical domain taxonomy

Unlike roadmap.sh's flat 82-directory structure, OST needs a **hierarchical domain taxonomy**:

```
athletics/
├── endurance/
│   ├── distance-running/
│   │   ├── 5k.yaml
│   │   ├── 10k.yaml
│   │   └── marathon.yaml
│   └── cycling/
├── strength/
│   ├── powerlifting/
│   └── olympic-lifting/
technology/
├── frontend/
├── backend/
creative/
├── music/
│   ├── instruments/
│   └── theory/
```

This enables:
- Namespaced skill IDs (e.g., `athletics/endurance/distance-running/5k`)
- Domain-level expert assignment for contribution review
- Cross-domain skill linkage
- Progressive disclosure in UIs

#### E. Benchmark schema as first-class citizen

This is OST's killer differentiator. Benchmarks should be:

```yaml
benchmarks:
  - id: "timed-5k"
    metric_type: "time"          # time | count | score | boolean | composite
    unit: "minutes"
    direction: "lower-is-better" # lower-is-better | higher-is-better
    assessment_method: "timed-race"
    source: "running-research-2024"  # citation for benchmark thresholds
    levels:
      - { level: 1, name: "Beginner", min: null, max: 40 }
      - { level: 2, name: "Intermediate", min: null, max: 28 }
      - { level: 3, name: "Advanced", min: null, max: 22 }
      - { level: 4, name: "Elite", min: null, max: 16 }
      - { level: 5, name: "World-Class", min: null, max: 13 }
    demographics:              # benchmarks may vary by population
      - group: "male-30-39"
        levels: [...]
      - group: "female-30-39"
        levels: [...]
```

### 5.3 Community Contribution Model

**Adopt from roadmap.sh:** Their contribution model works well — contributors submit PRs to add/edit content files. The `@nodeId` in filenames prevents merge conflicts. Their 1,486 contributors prove the model scales.

**Adapt for OST:**

1. **Skill proposals** — New skills are proposed via PR adding a YAML file. Domain experts review based on taxonomy placement and benchmark validity.
2. **Benchmark citations** — Every benchmark threshold must include a source (journal, coaching standard, competition data). This is the quality bar that separates OST from opinion.
3. **Schema validation** — CI validates all YAML files against a JSON Schema on every PR. Roadmap.sh has no schema validation — they rely on the visual editor to produce valid JSON. OST needs stricter governance since humans will author YAML directly.
4. **Domain maintainers** — Assign CODEOWNERS by domain path (e.g., `athletics/**` → running-experts team). Roadmap.sh has a single maintainer bottleneck.

### 5.4 What NOT to Adopt from Roadmap.sh

| Pattern | Why to Avoid |
|---------|-------------|
| Pixel positions in skill data | Couples data to a specific visual layout; prevents multi-platform use |
| Nanoid-based opaque node IDs | Human-readable hierarchical IDs are better for a standard/taxonomy |
| Visual-only relationships (solid/dashed edges) | Need typed, semantic relationships |
| Regex-based resource categorization (`@type@`) | Fragile; use structured frontmatter in content files |
| Single `.json` file per roadmap | Won't scale for domains with 1000+ skills; use one file per skill |
| Binary self-assessment progress | Need benchmark-based quantitative assessment |

---

## 6. Summary Comparison

| Dimension | Roadmap.sh | OST (Recommended) |
|-----------|-----------|-------------------|
| **Data format** | React Flow JSON (visual layout) | Semantic YAML (structure-first) |
| **Node identity** | Opaque nanoid | Hierarchical path ID (`domain/skill`) |
| **Relationships** | Untyped visual edges | Typed, weighted, directed edges |
| **Hierarchy** | Visual grouping only | Explicit parent-child taxonomy |
| **Content** | Markdown files per node | Markdown files per skill (adopted) |
| **Benchmarks** | None (binary completion) | First-class quantitative schema |
| **Cross-domain** | `relatedRoadmaps` array | Node-level cross-domain edges |
| **Contribution** | PR-based content edits | PR-based YAML + CI schema validation |
| **Scale** | 82 roadmaps, ~200 nodes each | Unbounded domains, 1000+ skills each |
| **Governance** | Single maintainer | Domain-specific CODEOWNERS |

---

## 7. Recommended Next Steps

1. **Define the OST JSON Schema** — Formalize the skill node schema, relationship types, and benchmark schema as a JSON Schema that can validate YAML contributions via CI.
2. **Build a seed taxonomy** — Start with 1-2 domains (e.g., distance running + frontend development) to validate the schema against both athletic and technical skills.
3. **Create contribution guidelines** — Document how to propose a new skill, what benchmark evidence is required, and how domain review works.
4. **Evaluate graph database vs file-based** — For the API/query layer, consider whether a graph database (Neo4j, Dgraph) or a file-based approach with build-time indexing (like roadmap.sh's Astro static site) better serves OST's needs.
5. **Design the layout engine** — If visual roadmap rendering is desired, build a layout computation layer that takes the semantic graph and produces visual layouts, rather than storing layouts in the skill data.
