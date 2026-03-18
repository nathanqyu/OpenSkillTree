/**
 * OpenSkillTree — Core Data Model
 *
 * This file defines the canonical TypeScript types for the OpenSkillTree schema.
 * All API responses, database rows, and JSON exports conform to these shapes.
 *
 * Schema overview:
 *   SkillTree    — a named collection of skills in a domain
 *   SkillNode    — an individual skill within a tree
 *   SkillEdge    — a prerequisite relationship between two nodes
 *   UserProgress — a user's progress on a node (deferred from MVP V1)
 *
 * See: /db/schema.sql for the corresponding Postgres schema.
 */

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export type Uuid = string;
export type IsoTimestamp = string;

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
  title: string;
  description: string;
  /** Display name or handle for the contributor. No auth in V1 — free text. */
  author: string;
  /**
   * Top-level domain category. Examples: "Sports", "Technology", "Creative",
   * "Business", "Science". Used for browse/filter UI.
   */
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

/**
 * A benchmark describes mastery criteria at a specific level within a skill.
 *
 * Design note: structured (not free-form markdown) so tooling can render level
 * selectors, filter by level, and compare benchmarks across trees programmatically.
 * The `metrics` array captures quantitative targets where they exist.
 *
 * Example:
 *   {
 *     level: "beginner",
 *     criteria: "Can execute 5 serves in a row with > 60% first-serve percentage.",
 *     metrics: ["≥ 60% first-serve %", "5 consecutive serves"]
 *   }
 */
export interface SkillBenchmark {
  level: "beginner" | "intermediate" | "advanced" | "expert";
  criteria: string;
  metrics?: string[];
}

/**
 * A SkillNode represents one skill within a SkillTree.
 *
 * Position (x, y) is the node's location on the visualization canvas.
 * Benchmarks capture what mastery looks like at each level — this is the
 * core differentiator of OpenSkillTree vs. generic mind-map tools.
 */
export interface SkillNode {
  id: Uuid;
  treeId: Uuid;
  title: string;
  description: string;
  /**
   * Ordered from beginner → expert. At least one benchmark is required
   * for a node to be considered "complete" in the schema.
   */
  benchmarks: SkillBenchmark[];
  /** Canvas position for the graph visualization. */
  position: { x: number; y: number };
  /** Optional icon identifier (e.g., a Lucide icon name or an image URL). */
  icon?: string;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
}

// ---------------------------------------------------------------------------
// SkillEdge
// ---------------------------------------------------------------------------

/**
 * A SkillEdge represents a directed prerequisite relationship.
 *
 * Direction: sourceNode must be completed before targetNode becomes available.
 * In other words: source → target means "source unlocks target".
 *
 * Cycles are not permitted (the graph must be a DAG).
 */
export interface SkillEdge {
  id: Uuid;
  treeId: Uuid;
  /** The prerequisite node — must be completed first. */
  sourceNodeId: Uuid;
  /** The node that becomes available once sourceNode is completed. */
  targetNodeId: Uuid;
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
// API / client-side helpers
// ---------------------------------------------------------------------------

/**
 * Lightweight summary used in gallery/browse views.
 * Does not include the full node/edge graph.
 */
export interface SkillTreeSummary {
  id: Uuid;
  title: string;
  description: string;
  author: string;
  domain: string;
  visibility: SkillTreeVisibility;
  nodeCount: number;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
}

/**
 * Ephemeral client-side progress map (MVP V1).
 * Keyed by nodeId; never persisted to the server.
 */
export type EphemeralProgressMap = Record<Uuid, UserProgressStatus>;
