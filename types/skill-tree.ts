/**
 * OpenSkillTree — Core Data Model
 *
 * This file defines the canonical TypeScript types for the OpenSkillTree schema.
 * All API responses, database rows, and JSON exports conform to these shapes.
 *
 * Schema overview:
 *   SkillTree         — a named collection of skills in a domain
 *   SkillNode         — an individual skill within a tree
 *   SkillEdge         — a prerequisite relationship between two nodes (intra-tree)
 *   CrossTreeLink     — a relationship linking skills across different trees (V2)
 *   UserProgress      — a user's progress on a node (deferred from MVP V1)
 *
 * See: /db/schema.sql for the corresponding Postgres schema.
 * See: /schema/skill-tree.schema.json for the YAML contribution schema.
 */

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export type Uuid = string;
export type IsoTimestamp = string;

/** Top-level domains supported in V1. Extensible via GitHub Discussion. */
export type SkillDomain =
  | "Sports"
  | "Technology"
  | "Creative Arts"
  | "Business"
  | "Science"
  | "Soft Skills";

// ---------------------------------------------------------------------------
// SkillTree
// ---------------------------------------------------------------------------

export type SkillTreeVisibility = "public" | "unlisted" | "private";

/**
 * A SkillTree is a named, author-owned collection of skill nodes and edges
 * representing progression in a particular domain (e.g., "Tennis Serve",
 * "TypeScript Fundamentals", "Sourdough Baking").
 */
export interface SkillTree {
  id: Uuid;
  /** Human-readable path ID, e.g. "sports/pickleball". Used in YAML and API URLs. */
  pathId: string;
  title: string;
  description: string;
  domain: string;
  visibility: SkillTreeVisibility;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
}

/** SkillTree enriched with its nodes and edges — used in JSON export and full tree views. */
export interface SkillTreeWithGraph extends SkillTree {
  nodes: SkillNode[];
  edges: SkillEdge[];
}

// ---------------------------------------------------------------------------
// SkillNode
// ---------------------------------------------------------------------------

/** A learning resource (tutorial, video, course, etc.) linked from a benchmark. */
export interface BenchmarkResource {
  title: string;
  url: string;
  type?: "video" | "article" | "course" | "book" | "tool" | "exercise";
}

// ---------------------------------------------------------------------------
// Evidence & Assessment  (benchmark measurement layer)
// ---------------------------------------------------------------------------

/**
 * What kind of evidence demonstrates proficiency.
 *
 * Each type implies a different measurement approach:
 *   - quantitative: repeatable numeric measurement (time, distance, score)
 *   - demonstration: perform the skill live or on video
 *   - portfolio: artifact, work product, or recorded output
 *   - observation: assessed by a coach, peer, or evaluator watching
 *   - self-report: learner's own structured reflection
 *   - peer-review: evaluated by peers against shared criteria
 *   - written: test, essay, or written deliverable
 *   - certification: external credential or standardized exam
 */
export type EvidenceType =
  | "quantitative"
  | "demonstration"
  | "portfolio"
  | "observation"
  | "self-report"
  | "peer-review"
  | "written"
  | "certification";

/**
 * A specific piece of evidence that can demonstrate proficiency at a benchmark level.
 *
 * `signal` captures how repeatable and context-independent the evidence tends to be,
 * without claiming false objectivity:
 *   - strong: consistently measurable, low evaluator variance (e.g., timed test, pass/fail metric)
 *   - moderate: structured evaluation with some subjectivity (e.g., rubric-scored portfolio)
 *   - contextual: depends heavily on evaluator, setting, or interpretation (e.g., peer feedback)
 */
export interface EvidenceRequirement {
  type: EvidenceType;
  description: string;
  signal: "strong" | "moderate" | "contextual";
}

/**
 * How proficiency at a benchmark level can be assessed.
 *
 * Current methods represent what is practical today. Future-facing methods
 * (sensor-data, ai-analysis) are included to preserve extensibility for
 * coach, AI, and sensor-based assessment pipelines.
 */
export type AssessmentMethod =
  | "coach-observation"
  | "video-review"
  | "timed-test"
  | "rubric-evaluation"
  | "peer-assessment"
  | "self-assessment"
  | "portfolio-review"
  | "competition-result"
  | "certification-exam"
  | "automated-test"
  | "sensor-data"
  | "ai-analysis";

// ---------------------------------------------------------------------------
// SkillBenchmark
// ---------------------------------------------------------------------------

/**
 * A benchmark describes mastery criteria at a specific level within a skill.
 *
 * Design note: structured (not free-form markdown) so tooling can render level
 * selectors, filter by level, and compare benchmarks across trees programmatically.
 *
 * The benchmark cleanly separates three concerns:
 *   1. **Criteria & evidence** — what proficiency looks like and how to demonstrate it
 *   2. **Assessment** — how proficiency can be evaluated
 *   3. **Guidance** — resources, practice, projects, and tips for reaching this level
 */
export interface SkillBenchmark {
  level: "beginner" | "intermediate" | "advanced" | "expert";

  // --- Criteria: what proficiency looks like ---
  criteria: string;
  /** Quantitative targets where they exist (not all skills have these). */
  metrics?: string[];

  // --- Evidence: what demonstrates proficiency ---
  /** Specific evidence that can demonstrate competence at this level. */
  evidence?: EvidenceRequirement[];

  // --- Assessment: how to evaluate ---
  /** Methods suitable for evaluating proficiency at this level. */
  assessmentMethods?: AssessmentMethod[];
  /** Notes about measurement limitations, context-dependence, or evaluator guidance. */
  assessmentNotes?: string;

  // --- Guidance: how to get there ---
  /** Tutorials, videos, courses, or tools to help reach this level. */
  resources?: BenchmarkResource[];
  /** Specific drills, exercises, or practice routines with time estimates. */
  practice?: string[];
  /** Concrete things to build, achieve, or demonstrate at this level. */
  projects?: string[];
  /** Common mistakes and how to avoid them. */
  tips?: string[];
}

/**
 * A SkillNode represents one skill within a SkillTree.
 *
 * Note: no position data is stored — visual layout is computed client-side
 * using ELK (layered hierarchical algorithm) from the semantic graph structure.
 * See ADR-003 in docs/ost-scalable-architecture.md.
 *
 * Benchmarks capture what mastery looks like at each level — this is the
 * core differentiator of OpenSkillTree vs. generic mind-map tools.
 */
export interface SkillNode {
  id: Uuid;
  treeId: Uuid;
  /** Human-readable path ID, e.g. "sports/pickleball/serve". */
  pathId: string;
  title: string;
  description: string;
  /**
   * Ordered from beginner → expert. At least one benchmark is required
   * for a node to be considered "complete" in the schema.
   */
  benchmarks: SkillBenchmark[];
  /** Optional icon identifier (e.g., a Lucide icon name or an image URL). */
  icon?: string;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
}

// ---------------------------------------------------------------------------
// SkillEdge
// ---------------------------------------------------------------------------

export type RelationshipType =
  | "requires"      // target cannot be attempted without source
  | "enables"       // source makes target accessible / recommended
  | "component-of"  // source is a sub-skill composing target
  | "complementary" // source and target mutually reinforce each other
  | "variant-of";   // source and target are parallel approaches

/**
 * A SkillEdge represents a directed relationship between two nodes in the same tree.
 *
 * The most common type is "requires": source → target means source must be
 * completed before target becomes available. The graph must be a DAG (no cycles).
 */
export interface SkillEdge {
  id: Uuid;
  treeId: Uuid;
  /** The source node — completed first. */
  sourceNodeId: Uuid;
  /** The target node — unlocked after source. */
  targetNodeId: Uuid;
  relationshipType: RelationshipType;
}

// ---------------------------------------------------------------------------
// CrossTreeLink  (V2 — cross-domain skill discovery)
// ---------------------------------------------------------------------------

/**
 * A link from a node in one tree to a node in a different tree.
 * Used for cross-domain discovery ("Tennis Serve → Pickleball Serve").
 * Populated via the skill_cross_edges table.
 */
export interface CrossTreeLink {
  relationshipType: RelationshipType;
  targetTreeId: Uuid;
  targetTreePathId: string;
  targetTreeTitle: string;
  targetTreeDomain: string;
  targetNodeId: Uuid;
  targetNodePathId: string;
  targetNodeTitle: string;
  /** Truncated at 200 chars for inline preview cards. */
  targetNodeDescription: string;
  /** Count of benchmark levels defined on the target node. */
  targetNodeLevelCount: number;
}

// ---------------------------------------------------------------------------
// UserProgress  (deferred from MVP V1 — ephemeral self-assessment is client-side)
// ---------------------------------------------------------------------------

export type UserProgressStatus = "locked" | "in_progress" | "completed";

/**
 * Tracks an individual user's progress on a specific skill node.
 *
 * NOTE: Excluded from MVP V1. Ephemeral self-assessment is stored in the
 * browser session only. This type is defined here for completeness and future
 * use when authentication is added.
 */
export interface UserProgress {
  userId: string;
  nodeId: Uuid;
  status: UserProgressStatus;
  completedAt?: IsoTimestamp;
}

// ---------------------------------------------------------------------------
// API response types
// ---------------------------------------------------------------------------

/**
 * Lightweight summary used in the gallery/browse view.
 * Served from the skill_tree_summaries materialized view.
 */
export interface TreeListItem {
  id: Uuid;
  pathId: string;
  title: string;
  description: string;
  domain: string;
  nodeCount: number;
  /** true if ALL nodes have ≥1 benchmark defined */
  hasBenchmarks: boolean;
  /** fraction 0–1 of nodes with ≥1 benchmark */
  benchmarkCoverage: number;
  createdAt: IsoTimestamp;
}

export interface TreeListResponse {
  trees: TreeListItem[];
  total: number;
  page: number;
  pageSize: number;
}

/** Full node detail response, including cross-tree links. */
export interface NodeDetailResponse extends SkillNode {
  crossTreeLinks: CrossTreeLink[];
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export type SearchResultKind = "tree" | "node";

/**
 * A single search result — either a tree or a node within a tree.
 * Node results include parent tree context for display.
 */
export interface SearchResultItem {
  kind: SearchResultKind;
  score: number;
  treeId: Uuid;
  treePathId: string;
  treeTitle: string;
  treeDomain: string;
  treeDescription: string;
  /** Only set when kind === "node" */
  nodeId?: Uuid;
  nodePathId?: string;
  nodeTitle?: string;
  nodeDescription?: string;
}

export interface SearchResponse {
  results: SearchResultItem[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
}

// ---------------------------------------------------------------------------
// Client-side helpers
// ---------------------------------------------------------------------------

/**
 * Ephemeral client-side progress map (MVP V1).
 * Keyed by nodeId; never persisted to the server.
 * Stored in sessionStorage as JSON.
 */
export type EphemeralProgressMap = Record<Uuid, UserProgressStatus>;

/**
 * Per-node level self-assessment. Maps nodeId to the highest benchmark level
 * the user feels they've reached. null = not assessed (show beginner guidance).
 * Used by the "What to Do Next" section to determine which level's resources to show.
 */
export type BenchmarkLevelValue = SkillBenchmark["level"];
export type EphemeralLevelMap = Record<Uuid, BenchmarkLevelValue | null>;
