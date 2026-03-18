# OpenSkillTree — Scalable Architecture Design

**Author:** VP of Engineering
**Date:** 2026-03-18
**Issue:** OPE-4
**Status:** Draft — pending PM review

---

## 1. Purpose

This document defines the technical architecture for OpenSkillTree (OST) at scale. It supersedes the prototype-first approach and addresses the board's directive to think through architecture before building.

The design must support:
- **Millions of skill nodes** across hundreds of domains
- **Community-driven contributions** via open-source PRs
- **Flexible query patterns** (traverse prerequisites, find skills by benchmark level, cross-domain discovery)
- **Multiple consumption surfaces** (web UI, JSON export, embeddable widget, third-party API)

Prior inputs informing this document:
- `docs/roadmap-sh-architecture-analysis.md` — framework analysis (OPE-7)
- `types/skill-tree.ts` — canonical TypeScript types (OPE-3)
- `db/schema.sql` — Postgres DDL (OPE-3)
- `PRODUCT.md` — MVP product spec (OPE-5)
- `data/seeds/` — PM's seed YAML files (OPE-11)

---

## 2. Architecture Overview

OST operates in three layers:

```
┌─────────────────────────────────────────────────────────┐
│                   CONTRIBUTION LAYER                    │
│  GitHub repo → YAML files → CI validation → merge      │
│  (source of truth: human-authored semantic skill data)  │
└──────────────────────┬──────────────────────────────────┘
                       │ ingest pipeline (build-time + on-demand)
┌──────────────────────▼──────────────────────────────────┐
│                      DATA LAYER                         │
│  PostgreSQL (primary) + Redis (cache) + Search index    │
│  (queryable, indexed, API-ready representation)         │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API / JSON
┌──────────────────────▼──────────────────────────────────┐
│                   FRONTEND LAYER                        │
│  Next.js App Router + React Flow (graph) + Zustand      │
│  (interactive skill tree visualization and browsing)    │
└─────────────────────────────────────────────────────────┘
```

The key architectural principle: **YAML files are the source of truth**. The database is a derived, queryable index. This separates contribution (Git-native) from consumption (API-native).

---

## 3. Framework Evaluation

### 3.1 Graph Visualization Libraries

The skill tree UI requires a graph rendering library. Evaluated options:

| Library | Stars | Rendering | Nodes at 60fps | Best For | OST Fit |
|---------|-------|-----------|----------------|----------|---------|
| **React Flow** | 28k+ | SVG/HTML | <1,000 | Interactive editors, small-medium graphs | ✅ MVP, per-tree view |
| **Cytoscape.js** | 10k+ | Canvas/SVG | ~10,000 | Semantic graphs, analytics, layout algorithms | ✅ Full cross-domain view |
| **Sigma.js** | 12k+ | WebGL | 100,000+ | Large graph exploration, network analysis | ⚠️ Future — overkill for MVP |
| **D3.js** | 108k+ | SVG | ~5,000 | Custom layouts, max flexibility | ⚠️ Too low-level for MVP |
| **Elk.js** | 900+ | Layout only | N/A | Advanced auto-layout (integrates with React Flow) | ✅ Layout engine |
| **vis.js** | 19k+ | Canvas | ~5,000 | Generic network visualization | ❌ Less maintained |

**Decision: Two-tier rendering strategy**

1. **React Flow** for individual skill tree views (per-tree, <200 nodes). Best developer experience, React-native, already used by roadmap.sh. Pair with **elkjs** for automatic hierarchical layout from the YAML graph structure (so we never store pixel positions in skill data).

2. **Cytoscape.js** (or Sigma.js) for future cross-domain skill graph exploration views (1,000+ nodes spanning multiple trees). Plan for this but do not build for MVP.

**Why not D3:** Too low-level. Forces us to reinvent node/edge interaction primitives that React Flow provides out of the box. Re-evaluate if we need custom physics simulations.

### 3.2 Data Storage Options

| Option | Graph Traversal | Scale | Ops Complexity | OST Fit |
|--------|----------------|-------|----------------|---------|
| **PostgreSQL + recursive CTEs** | Good (WITH RECURSIVE) | Millions of nodes | Low | ✅ Primary choice |
| **Neo4j** | Native Cypher queries | Billions of edges | High | ⚠️ Future — graph analytics |
| **Postgres + pg_routing** | Good | Large | Medium | ⚠️ Overkill for current use |
| **File-based only** | Not supported | Unlimited files | Very low | ❌ No real-time queries |
| **SQLite** | Poor | <100k nodes | Very low | ❌ Not suitable at scale |

**Decision: PostgreSQL as primary query store**

PostgreSQL with `WITH RECURSIVE` CTEs handles all required graph queries:
- Find all prerequisites for a skill (ancestor traversal)
- Find all skills unlocked by completing a skill (descendant traversal)
- Detect cycles (DFS via recursive CTE)
- Domain-filtered browsing (standard `WHERE`)

Postgres also provides GIN indices for full-text search and JSONB for the benchmark schema. No separate search service needed until scale demands it (>10M nodes).

**Future path:** Add Neo4j or a graph analytics layer (Apache AGE Postgres extension) when cross-domain skill discovery and "people who mastered X also mastered Y" queries become relevant.

### 3.3 API Architecture

| Pattern | Flexibility | Caching | Type Safety | Learning Curve |
|---------|------------|---------|------------|----------------|
| **REST (Next.js API Routes)** | Medium | Excellent (HTTP cache) | Good (via Zod) | Low |
| **GraphQL** | High | Harder | Excellent | Medium |
| **tRPC** | Medium | Good | Excellent (end-to-end) | Medium |

**Decision: REST via Next.js API Routes (with tRPC considered for V2)**

For MVP: REST API routes in Next.js App Router. Clear HTTP semantics, trivial CDN caching of GET endpoints, no schema overhead. API routes double as the JSON export endpoint.

For V2: tRPC for internal type-safe client-server calls if the frontend grows complex. GraphQL only if third-party integrations need deep query flexibility.

---

## 4. Data Layer Architecture

### 4.1 Source of Truth: YAML Skill Files

```
data/
├── seeds/                     # Seed trees (contribution examples)
│   ├── sports/
│   └── business/
└── skills/                    # Community-contributed skill trees (future)
    ├── sports/
    │   ├── pickleball/
    │   │   └── tree.yaml
    │   └── tennis/
    │       └── tree.yaml
    └── technology/
        └── frontend/
            └── tree.yaml
```

Each `tree.yaml` follows the schema already established in `data/seeds/`:

```yaml
tree:
  id: "sports/pickleball"
  title: "Pickleball"
  domain: "Sports"
  description: "..."

nodes:
  - id: "sports/pickleball/serve"
    title: "Serve"
    benchmarks:
      - level: beginner
        criteria: "..."
        metrics: ["..."]

relationships:
  - source: "sports/pickleball/serve"
    target: "sports/pickleball/third-shot-drop"
    type: requires
```

**Critical: Node IDs are hierarchical path strings** (`sports/pickleball/serve`), not UUIDs. Path IDs are human-readable, diffable, and prevent merge conflicts in community PRs. The database stores a UUID primary key alongside the path ID for query performance.

### 4.2 Schema Validation in CI

Every PR that modifies `data/**/*.yaml` runs:

1. **JSON Schema validation** — YAML parsed and validated against the OST JSON Schema (to be defined as `schema/skill-tree.schema.json`)
2. **DAG validation** — Python/Node script checks that relationships within each tree form a valid DAG (no cycles)
3. **Benchmark completeness check** — Warns if any node has 0 benchmarks
4. **Cross-reference validation** — Relationship source/target IDs must exist in the same tree

This is the governance layer that roadmap.sh lacks. No visual editor generates the data — humans author YAML, and CI enforces quality.

### 4.3 Ingest Pipeline

```
YAML files (git)
  → ingest script (Node.js)
    → parse YAML
    → validate schema (zod)
    → upsert to PostgreSQL (tree + nodes + edges)
    → invalidate Redis cache keys
```

Ingest runs:
- At deploy time (full re-ingest of all trees)
- Via webhook on PR merge to main (incremental re-ingest of changed trees)
- On-demand via admin endpoint (for development)

This ensures the database is always a consistent projection of the YAML source of truth.

### 4.4 Postgres Schema Evolution

The existing `db/schema.sql` covers the MVP. Required additions for scale:

```sql
-- Path ID for human-readable skill references
ALTER TABLE skill_trees ADD COLUMN path_id VARCHAR(255) UNIQUE;
ALTER TABLE skill_nodes ADD COLUMN path_id VARCHAR(255) UNIQUE;

-- Relationship type (requires / enables / component-of / etc.)
ALTER TABLE skill_edges ADD COLUMN relationship_type VARCHAR(50)
    NOT NULL DEFAULT 'requires'
    CHECK (relationship_type IN ('requires', 'enables', 'component-of', 'complementary', 'variant-of'));

-- Source file tracking (for cache invalidation and attribution)
ALTER TABLE skill_trees ADD COLUMN source_file VARCHAR(500);
ALTER TABLE skill_trees ADD COLUMN content_hash VARCHAR(64);

-- Cross-tree edges (for cross-domain skill links in V2)
-- Note: source and target can belong to different trees
CREATE TABLE skill_cross_edges (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_node_id  UUID NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
    target_node_id  UUID NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL DEFAULT 'complementary',
    CONSTRAINT uq_cross_edge UNIQUE (source_node_id, target_node_id),
    CONSTRAINT chk_cross_no_self_loop CHECK (source_node_id <> target_node_id)
);
```

---

## 5. API Layer Design

### 5.1 Route Structure

All routes live in `app/api/` (Next.js App Router). Public, read-only for MVP.

```
GET  /api/trees                     # List all trees (paginated, filterable by domain)
GET  /api/trees/:treeId             # Get tree with all nodes + edges
GET  /api/trees/:treeId/export      # Download tree as JSON (export flow)
GET  /api/nodes/:nodeId             # Get single node with benchmarks
GET  /api/nodes/:nodeId/ancestors   # Get all prerequisite nodes (recursive traversal)
GET  /api/nodes/:nodeId/descendants # Get all unlocked nodes (recursive traversal)
GET  /api/search?q=:query           # Full-text search across all trees
```

### 5.2 Tree List Response

```typescript
interface TreeListItem {
  id: string;
  pathId: string;          // "sports/pickleball"
  title: string;
  domain: string;
  description: string;
  nodeCount: number;
  createdAt: string;
}

interface TreeListResponse {
  trees: TreeListItem[];
  total: number;
  page: number;
  pageSize: number;
}
```

### 5.3 Ancestor/Descendant Traversal (Postgres recursive CTE)

```sql
-- All prerequisites (ancestors) of a given node
WITH RECURSIVE ancestors AS (
  SELECT source_node_id AS node_id, 1 AS depth
  FROM skill_edges
  WHERE target_node_id = $1
    AND relationship_type = 'requires'
  UNION ALL
  SELECT e.source_node_id, a.depth + 1
  FROM skill_edges e
  JOIN ancestors a ON e.target_node_id = a.node_id
  WHERE e.relationship_type = 'requires'
    AND a.depth < 50  -- cycle guard
)
SELECT n.*, a.depth
FROM skill_nodes n
JOIN ancestors a ON n.id = a.node_id
ORDER BY a.depth DESC;
```

This query retrieves the full prerequisite chain in a single round-trip — no application-level graph walking needed.

### 5.4 Caching Strategy

| Route | Cache | TTL | Invalidation |
|-------|-------|-----|--------------|
| `GET /api/trees` | Redis + HTTP `Cache-Control` | 1h | On ingest |
| `GET /api/trees/:id` | Redis per tree | 24h | On ingest for that tree |
| `GET /api/trees/:id/export` | Static file generation | Until tree updated | On ingest |
| `GET /api/search` | Redis per query hash | 15m | On ingest |
| `GET /api/nodes/:id/ancestors` | Redis per node | 24h | On ingest for parent tree |

For MVP (small data), skip Redis and rely on HTTP `Cache-Control` headers with Next.js ISR (Incremental Static Regeneration). Add Redis when tree count exceeds 100.

---

## 6. Frontend Architecture

### 6.1 Component Hierarchy

```
app/
├── page.tsx                    # Gallery / Browse (Flow 1)
├── trees/
│   └── [treeId]/
│       └── page.tsx            # Tree visualization (Flow 2 + 3)
│
components/
├── skill-tree/
│   ├── SkillTreeGraph.tsx      # React Flow wrapper — graph canvas
│   ├── SkillNode.tsx           # Custom React Flow node component
│   ├── SkillEdge.tsx           # Custom React Flow edge component
│   └── NodeDetailPanel.tsx     # Side panel shown on node click
├── gallery/
│   ├── TreeCard.tsx            # Card in gallery view
│   └── DomainFilter.tsx        # Domain filter pills
└── layout/
    └── AppShell.tsx            # Top nav, layout wrapper
```

### 6.2 State Management

**Ephemeral progress** (self-assessment, MVP): React state within the tree page — no store needed. A `Map<nodeId, level>` stored in `useState`. Optionally persist to `sessionStorage` to survive page refreshes.

**App-wide state** (if needed): Zustand. Lightweight, does not require providers, works well with Next.js. Use only when prop drilling becomes a problem (>2 levels).

**Server state** (tree/node data): SWR or React Query for data fetching, caching, and revalidation. Avoids prop drilling of fetched data and handles loading/error states cleanly.

### 6.3 Graph Layout

Since skill tree YAML defines semantic relationships (not pixel positions), the frontend must compute a visual layout. Approach:

1. **Load tree data** (nodes + edges) from API
2. **Run ELK layout algorithm** client-side via `elkjs` (Layered / Hierarchical algorithm is ideal for prerequisite DAGs)
3. **Feed computed positions into React Flow** as the initial node positions
4. **User can then freely reposition** nodes (positions not persisted back — they're ephemeral)

ELK hierarchical layout produces clean top-to-bottom DAG visualizations that naturally communicate prerequisite ordering. This is superior to the force-directed default and consistent across page loads.

```typescript
// Layout computation
import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

async function computeLayout(nodes: SkillNode[], edges: SkillEdge[]) {
  const elkGraph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.spacing.nodeNode': '50',
      'elk.layered.spacing.nodeNodeBetweenLayers': '80',
    },
    children: nodes.map(n => ({ id: n.id, width: 180, height: 60 })),
    edges: edges.map(e => ({
      id: e.id,
      sources: [e.sourceNodeId],
      targets: [e.targetNodeId],
    })),
  };

  const layout = await elk.layout(elkGraph);
  return layout.children ?? [];
}
```

### 6.4 Node Visual Design

Each React Flow custom node shows:
- Skill title (bold)
- Benchmark level indicator (progress bar showing user's self-assessed level)
- Status indicator (locked / available / completed) derived from prerequisite completion state
- Click to open NodeDetailPanel

NodeDetailPanel (side panel) shows:
- Full description
- Benchmarks at each level with criteria + metrics
- Prerequisites (links to upstream nodes)
- What this unlocks (links to downstream nodes)
- Export button (triggers JSON download of just this node)

---

## 7. Contribution Model

### 7.1 PR-Based Contribution Flow

```
1. Contributor forks the repo
2. Creates/edits a YAML file in data/skills/{domain}/
3. Submits a PR
4. CI runs:
   - YAML parse + JSON Schema validation
   - DAG cycle detection
   - Benchmark completeness warning
5. Domain maintainer reviews (CODEOWNERS)
6. Merged → ingest pipeline runs → tree visible on site
```

### 7.2 JSON Schema for YAML Validation

Publish `schema/skill-tree.schema.json` — the formal, versioned contract for skill tree YAML files. This is the canonical spec that:
- Contributors author against
- CI validates against
- Third parties can build parsers/editors for

Define using JSON Schema Draft 2020-12. Include `$defs` for reusable types (BenchmarkLevel, RelationshipType, etc.).

### 7.3 CODEOWNERS

```
# CODEOWNERS
data/skills/sports/       @ost-sports-maintainers
data/skills/technology/   @ost-tech-maintainers
data/skills/creative/     @ost-creative-maintainers
data/seeds/               @ost-core-team
schema/                   @ost-core-team
```

Domain-specific review prevents the single-maintainer bottleneck that limits roadmap.sh's velocity.

---

## 8. Scale Design

### 8.1 What "At Scale" Means for OST

OST's growth vector is **breadth** (many domains) more than depth (large individual trees). A realistic 5-year projection:
- 500+ skill trees
- Average 30–50 nodes per tree
- ~25,000 total nodes
- ~50,000 total edges

At 100,000 nodes (very ambitious), PostgreSQL with proper indices handles this comfortably. The architecture does not need a graph database for this scale.

**The hard scale problem is not query performance — it is UI performance.** Rendering 200 nodes in React Flow is fine. Rendering 25,000 nodes simultaneously is not.

### 8.2 UI Scale Solutions

**Virtualization** — React Flow's `nodeOrigin` + viewport-based culling renders only visible nodes. For trees with >100 nodes, implement pagination or "focus mode" (show selected node + N levels of prerequisites/descendants).

**Tree-level isolation** — Never render multiple trees simultaneously. Each tree is an independent graph view. Cross-domain discovery is a list/search view, not a combined graph.

**Lazy loading of benchmarks** — Load node detail (benchmarks, description) on-demand when a node is clicked. Initial tree load only includes node IDs, titles, and positions for fast render.

### 8.3 Data Layer Scale Solutions

**Ingest deduplication** — Track `content_hash` per tree in the database. Only re-ingest trees whose YAML has changed. Prevents unnecessary DB writes on each deploy.

**Materialized views** — For the gallery (`/api/trees`), use a Postgres materialized view with node counts pre-computed. Refresh after each ingest.

```sql
CREATE MATERIALIZED VIEW skill_tree_summaries AS
SELECT
    st.*,
    COUNT(sn.id) AS node_count
FROM skill_trees st
LEFT JOIN skill_nodes sn ON sn.tree_id = st.id
GROUP BY st.id;

CREATE UNIQUE INDEX ON skill_tree_summaries (id);
```

**Full-text search indexing** — The GIN index on `to_tsvector(title || description)` in the current schema handles up to ~1M nodes. Above that, migrate to dedicated search (Meilisearch or Postgres `pg_vector` for semantic search).

---

## 9. Architecture Decision Records (ADRs)

### ADR-001: YAML as source of truth, not database

**Decision:** Skill data lives in YAML files in git. The database is a derived index.
**Rationale:** Git provides version history, contribution workflow (PRs), and diff-friendly review for free. Database-first would require a custom admin UI for contributions and lose the open-source collaboration model.
**Tradeoff:** Introduces an ingest pipeline; real-time contributions require a deploy or webhook.

### ADR-002: React Flow for MVP visualization

**Decision:** Use React Flow for the initial skill tree graph view.
**Rationale:** Best React integration, 28k stars, actively maintained, used by roadmap.sh (proven for this use case). Handles the <200 node count per tree comfortably.
**Tradeoff:** Not suitable for cross-domain mega-graphs (>1,000 nodes). Revisit with Cytoscape.js or Sigma.js for that use case.

### ADR-003: ELK for automatic layout

**Decision:** Compute visual layouts from the semantic graph using elkjs, not stored positions.
**Rationale:** Storing pixel positions in skill YAML (as roadmap.sh does) couples data to a specific visual layout. The same YAML should render correctly in any client without layout data.
**Tradeoff:** Adds a client-side layout computation step on first load (~50–200ms for typical trees).

### ADR-004: PostgreSQL over graph database

**Decision:** PostgreSQL with recursive CTEs, not Neo4j or similar.
**Rationale:** At OST's scale (10k–100k nodes), PostgreSQL handles all required graph queries. Neo4j adds operational complexity (separate service, different query language) with no meaningful benefit at this scale.
**Tradeoff:** If OST eventually needs advanced graph analytics (shortest path across thousands of trees, community detection), revisit with Apache AGE (PostgreSQL extension adding Cypher query support).

### ADR-005: Hierarchical path IDs for skill nodes

**Decision:** Skill nodes use human-readable path IDs (`sports/pickleball/serve`), not UUIDs, in YAML.
**Rationale:** Path IDs are contributor-friendly (no ID generation required), diff-readable, and prevent the opaque nanoid problem in roadmap.sh. The database stores both a UUID (for efficient joins) and the path ID (for API and YAML references).
**Tradeoff:** Path IDs require a uniqueness registry and versioning strategy when skills are reorganized.

---

## 10. MVP Build Sequence (What to Build First)

With the architecture settled, here is the correct build order — avoiding wasted work by building the right foundation first:

```
Phase 1 — Foundation (already partly done)
  ✅ YAML schema definition (seeds establish the format)
  ✅ PostgreSQL schema (db/schema.sql)
  ✅ TypeScript types (types/skill-tree.ts)
  🔲 Formal JSON Schema for CI validation (schema/skill-tree.schema.json)
  🔲 Ingest script (scripts/ingest.ts — YAML → Postgres)

Phase 2 — API
  🔲 GET /api/trees (list with pagination)
  🔲 GET /api/trees/:id (tree + nodes + edges)
  🔲 GET /api/trees/:id/export (JSON download)
  🔲 GET /api/nodes/:id/ancestors (prerequisite traversal)

Phase 3 — Frontend
  🔲 Gallery page (tree cards, domain filter)
  🔲 Tree visualization (React Flow + ELK layout)
  🔲 Node detail panel (benchmarks, prerequisites)
  🔲 Ephemeral self-assessment (click to mark level)

Phase 4 — Contribution Pipeline
  🔲 JSON Schema CI validation (GitHub Action)
  🔲 DAG cycle detection script
  🔲 CONTRIBUTING.md with domain expert guide
  🔲 CODEOWNERS setup
```

Phase 1 must complete before Phase 2. Phase 2 must complete before Phase 3. Phase 4 can run in parallel with Phase 3.

---

## 11. Open Questions for PM Alignment

These require PM input before finalizing the frontend design:

1. **Self-assessment UX:** How should users indicate their level on a node? Click-to-cycle through levels? A slider? A "rate yourself" button that opens a modal with benchmark criteria visible? The design affects how benchmarks are surfaced.

2. **Domain taxonomy top level:** Do we hardcode a top-level domain list (Sports / Technology / Creative / Business / Science) or let it emerge from contributor tags? Fixed taxonomy is cleaner for browse UX; open taxonomy scales better for a community-contributed standard.

3. **Empty state for trees without benchmarks:** Some skill trees will be contributed without quantitative benchmarks (especially early on). Do we block incomplete trees from the gallery, show them with a "needs benchmarks" label, or show all and let the community improve them over time?

4. **Cross-tree navigation:** When a node has a `complementary` relationship to a node in another tree, should the UI navigate to that other tree (breaking the current view) or open an inline preview? The answer affects cross-tree edge rendering.

---

*Coordinate on open questions with @Product Manager before building Phase 3 frontend. Architecture is stable for Phase 1 and 2 implementation to proceed.*
