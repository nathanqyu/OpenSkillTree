/**
 * Try-It Module Types
 *
 * Defines the data structures for skill exploration modules that point users
 * to external resources for actual practice, then capture feedback signals
 * (enjoyment, difficulty, resonance) to refine their discovery profile.
 *
 * This is domain-agnostic by design: tennis lessons, baking tutorials, and
 * coding exercises all follow the same feedback loop. The platform stays
 * horizontal — we don't build domain-specific tooling.
 */

import type { TraitScores } from "@/lib/discover-engine";

// ---------------------------------------------------------------------------
// Module Definitions
// ---------------------------------------------------------------------------

/** An external resource the user can try. */
export interface TryItResource {
  title: string;
  url: string;
  /** What the user will actually do there. */
  description: string;
  /** Estimated time commitment. */
  estimatedMinutes: number;
  /** Resource type for display. */
  type: "lesson" | "tutorial" | "course" | "exercise" | "video" | "class" | "tool";
}

/** A try-it module: a curated set of external resources for one skill node. */
export interface TryItModule {
  id: string;
  /** Path ID of the skill node, e.g. "technology/python/syntax-data-types". */
  nodePathId: string;
  /** Path ID of the parent tree, e.g. "technology/python". */
  treePathId: string;
  title: string;
  /** What the user will explore and why it matters. */
  description: string;
  /** What to pay attention to while trying the resource. */
  reflectionPrompts: string[];
  /** Curated external resources to try (1–3 options). */
  resources: TryItResource[];
  /** Trait profile for this module — used to compute signal deltas. */
  traitProfile: TraitScores;
}

// ---------------------------------------------------------------------------
// Feedback & Responses
// ---------------------------------------------------------------------------

/** Post-module feedback capturing 3 signals. */
export interface ModuleFeedback {
  /** 1–5: how much they enjoyed it. */
  enjoyment: number;
  /** 1–5: how natural it felt (aptitude proxy). */
  naturalness: number;
  /** Identity signal: could they see themselves doing more. */
  resonance: "yes" | "maybe" | "no";
  /** Which resource they tried (optional). */
  resourceUsed?: string;
}

/** Complete record of a module attempt. */
export interface ModuleResponse {
  moduleId: string;
  treePathId: string;
  nodePathId: string;
  feedback: ModuleFeedback;
  /** Computed trait deltas to apply to the profile. */
  traitDeltas: { interest: TraitScores; aptitude: TraitScores };
  completedAt: string;
}

// ---------------------------------------------------------------------------
// Refined Profile
// ---------------------------------------------------------------------------

/** Accumulated profile combining self-report and demonstrated signals. */
export interface RefinedProfile {
  /** Trait scores from the discovery questionnaire. */
  selfReport: { interest: TraitScores; aptitude: TraitScores };
  /** Accumulated trait scores from module completions. */
  moduleSignals: { interest: TraitScores; aptitude: TraitScores };
  /** Trait scores from the deep assessment (cognitive + self-reflection). */
  assessmentSignals?: { interest: TraitScores; aptitude: TraitScores };
  /** Full module response history. */
  moduleHistory: ModuleResponse[];
  /** Deep assessment result if completed. */
  assessmentResult?: import("@/types/assessment").AssessmentResult;
  updatedAt: string;
}
