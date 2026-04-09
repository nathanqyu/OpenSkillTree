/**
 * Deep Assessment Types
 *
 * A multi-section aptitude assessment combining cognitive tasks (pattern
 * recognition, scenario judgment, estimation) with self-reflection.
 * Cognitive tasks carry 3x weight; self-reflection carries 1x.
 * The overall assessment signal is weighted 2.5x when merged into the profile.
 */

import type { Trait, TraitScores } from "@/lib/discover-engine";

// ---------------------------------------------------------------------------
// Question Types
// ---------------------------------------------------------------------------

export type AssessmentQuestionType =
  | "number-sequence"
  | "odd-one-out"
  | "rapid-association"
  | "scenario-judgment"
  | "estimation"
  | "prioritization"
  | "energy-mapping"
  | "flow-state"
  | "discomfort-tolerance"
  | "single-select"
  | "multi-select";

export type AssessmentSignalType = "cognitive" | "self-reflection";

export interface AssessmentOption {
  id: string;
  label: string;
  /** For cognitive tasks with a correct answer. */
  correct?: boolean;
  /** For estimation: marks adjacent (partial credit) answers. */
  adjacent?: boolean;
  /** Trait weights this option signals for interest. */
  interest: TraitScores;
  /** Trait weights this option signals for aptitude. */
  aptitude: TraitScores;
}

export interface AssessmentQuestion {
  id: string;
  type: AssessmentQuestionType;
  signalType: AssessmentSignalType;
  title: string;
  subtitle?: string;
  /** For number-sequence: the correct numeric answer. */
  correctAnswer?: number;
  /** Tolerance for "close enough" on numeric answers. */
  tolerance?: number;
  options?: AssessmentOption[];
  /** For prioritization: how many to rank (defaults to all options). */
  rankCount?: number;
  /** Max selections for multi-select. */
  maxSelections?: number;
  /** Trait weights for the question overall (used for cognitive scoring). */
  traitWeights: TraitScores;
}

export interface AssessmentSection {
  id: string;
  title: string;
  subtitle: string;
  intro: string;
  questions: AssessmentQuestion[];
}

// ---------------------------------------------------------------------------
// Answers
// ---------------------------------------------------------------------------

export interface NumericAnswer {
  type: "numeric";
  value: number;
}

export interface SingleAnswer {
  type: "single";
  optionId: string;
}

export interface MultiAnswer {
  type: "multi";
  optionIds: string[];
}

export interface RankAnswer {
  type: "rank";
  rankedIds: string[];
}

export type AssessmentAnswer =
  | NumericAnswer
  | SingleAnswer
  | MultiAnswer
  | RankAnswer;

export type AssessmentAnswers = Record<string, AssessmentAnswer>;

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

export interface QuestionScore {
  questionId: string;
  signalType: AssessmentSignalType;
  /** 0–1 objective correctness (1.0 for self-reflection always). */
  correctness: number;
  interestDeltas: TraitScores;
  aptitudeDeltas: TraitScores;
}

export interface SectionSummary {
  sectionId: string;
  sectionTitle: string;
  topTraits: { trait: Trait; score: number }[];
  insight: string;
}

export interface AssessmentResult {
  answers: AssessmentAnswers;
  scores: QuestionScore[];
  traitDeltas: { interest: TraitScores; aptitude: TraitScores };
  sectionSummaries: SectionSummary[];
  elapsedSeconds: number;
  completedAt: string;
}
