# OpenSkillTree — MVP Product Spec

## Vision Alignment

OpenSkillTree is a **standard**, not a product. The MVP exists to validate the schema and make it real enough for domain experts and developers to evaluate, contribute to, and build on. We are not building a consumer app. We are building the foundation for one.

---

## Target User Personas

### 1. The Domain Expert
A coach, practitioner, researcher, or educator who has spent years developing intuition about what mastery looks like in their field. They understand skill progressions — but have never had a structured format to express or share that knowledge.

**Goals:** Explore existing trees, validate the schema is expressive enough to capture real domain structure, contribute their own expertise.
**Pain point:** Skill knowledge is trapped in their head or in proprietary systems. No shared format exists.

### 2. The Developer / Builder
An engineer, product designer, or technical founder who wants to build something on top of structured skill data — an AI coach, an assessment tool, a learning platform, a hiring product.

**Goals:** Evaluate the schema, query skill trees programmatically, understand what the data model enables.
**Pain point:** No open, structured skill taxonomy to build on. Starting from scratch every time.

---

## MVP Scope

The MVP answers one question: **Is the schema good enough to capture real skill progressions?**

To answer it, we need just enough UI for domain experts and developers to explore the data, validate the structure, and understand what it enables.

### In scope
- Browse available skill trees
- View a skill tree as an interactive graph
- Read benchmarks and descriptions at each skill node
- Understand prerequisites (which skills unlock which)
- Mark your current level (anonymous, ephemeral — no account required)
- Export a skill tree as JSON

### Out of scope (V1 non-goals)
- User accounts or authentication
- Persistent progress tracking
- AI coaching or recommendations
- Monetization or paywalls
- Collaborative editing
- Native mobile app
- Team or org features

---

## Core User Flows

### Flow 1: Browse & Discover
1. User lands on homepage
2. Sees a gallery of available skill trees (e.g., "JavaScript", "Tennis Serve", "Sourdough Baking")
3. Filters or searches by domain/category
4. Clicks into a tree

### Flow 2: Explore a Skill Tree
1. View the tree as an interactive graph
2. Nodes represent skills; edges represent prerequisites
3. Click a node to see:
   - Skill name and description
   - Level benchmarks (e.g., "Beginner: can execute 5 serves with >60% first serve %", "Advanced: 75%+ first serve, consistent topspin")
   - Sub-skills that compose this skill
   - What this skill unlocks (downstream nodes)
4. Pan, zoom, and navigate the graph freely

### Flow 3: See Your Position
1. User self-assesses by clicking nodes and marking them (e.g., "I'm here")
2. State is ephemeral (stored in browser session only — no account required)
3. Marked nodes are visually highlighted on the graph
4. User can see where they sit in the progression at a glance

### Flow 4: Export
1. From a tree view, user clicks "Export"
2. Downloads the full tree as JSON (matching the open schema)
3. Can use this to build on, fork, or validate the data structure

---

## Feature List

### Must-Have (MVP)

| Feature | Description |
|---------|-------------|
| Skill tree gallery | Browse all published trees with title, domain, node count |
| Graph visualization | Interactive node/edge rendering with pan + zoom |
| Node detail panel | Show benchmark text, description, sub-skills, prerequisites |
| Ephemeral self-assessment | Click to mark current level; stored in browser only |
| JSON export | Download full tree schema as JSON |
| Schema documentation | Human-readable docs explaining the data model fields |

### Nice-to-Have (Post-MVP)

| Feature | Description |
|---------|-------------|
| Search | Full-text search across skill tree names and node descriptions |
| Domain filtering | Browse by category (sports, tech, creative, etc.) |
| Embeddable widget | Drop a skill tree visualization into any webpage |
| Contributor submission form | Web form to propose a new skill tree |
| Permalink to node | Share a link to a specific node in a tree |

---

## Data Model Alignment (with OPE-3)

The product spec is designed around the core data model being defined in [OPE-3](/OPE/issues/OPE-3):

```
SkillTree     id, title, description, domain, visibility, createdAt
SkillNode     id, treeId, title, description, level, benchmarks[], icon
SkillEdge     id, treeId, sourceNodeId, targetNodeId  (prerequisite → unlocks)
```

**MVP note:** `UserProgress` (userId, nodeId, status) is **excluded** from V1. Ephemeral self-assessment is purely client-side and never persisted to the database.

**Key constraint for the data model:** Each `SkillNode` must support `benchmarks[]` — an array of level descriptors with quantitative criteria. This is what differentiates OpenSkillTree from generic mind-map tools. Without benchmark data, the node is incomplete.

---

## Success Metrics

The MVP is successful if:

1. **Schema validation:** At least 3 domain experts can review a skill tree and say "yes, this captures the real structure of my domain" without needing to add fields or workarounds.

2. **Developer legibility:** A developer unfamiliar with the project can read the schema docs, fetch the JSON export, and understand the data model in under 15 minutes.

3. **Coverage proof:** We publish at least 5 complete skill trees across distinct domains (e.g., programming, a sport, a creative skill), each with at least 15 nodes and meaningful benchmarks.

4. **Open source engagement:** The repo receives at least 10 external contributions (PRs, issues, or submitted trees) within 30 days of launch.

---

## Non-Goals for V1

These are explicitly deferred to avoid scope creep and to keep the MVP focused on schema validation:

- **No user accounts.** Authentication adds complexity and isn't needed to validate the schema.
- **No persistent progress tracking.** The data structure exists (UserProgress), but wiring it up requires auth. Defer.
- **No AI coaching.** This is a natural future use case — the schema enables it — but it's not what the MVP needs to prove.
- **No monetization.** The standard is free and open. Revenue models are a later conversation.
- **No mobile app.** A responsive web UI is sufficient for V1.
- **No social features.** Likes, follows, comments — not needed to prove the schema works.

---

## Open Questions (for CEO + VPE review)

1. **Benchmark format:** Should `benchmarks` be free-form markdown text, or structured (e.g., `{ level: "beginner", criteria: "...", metrics: [...] }`)? Structured is more powerful for tooling but harder to author.

2. **Tree seeding:** Who creates the first 5 skill trees? CEO + domain expert outreach? Or do we ship with 1-2 and crowdsource from there?

3. **Domain taxonomy:** Do we define a top-level domain list upfront (Sports / Technology / Creative / Business / etc.), or let contributors tag freely?

---

*Spec authored by Product Manager. Coordinate on data model specifics with VPE ([OPE-3](/OPE/issues/OPE-3)). Review and ratify with CEO before marking done.*
