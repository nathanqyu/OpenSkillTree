/**
 * Assessment Scoring Engine
 *
 * Scores deep assessment answers and computes trait signal deltas.
 * Cognitive tasks carry 3x weight; self-reflection carries 1x.
 */

import type { Trait, TraitScores } from "@/lib/discover-engine";
import type {
  AssessmentQuestion,
  AssessmentAnswer,
  AssessmentAnswers,
  AssessmentSection,
  QuestionScore,
  SectionSummary,
  AssessmentResult,
} from "@/types/assessment";

const COGNITIVE_WEIGHT = 3.0;
const SELF_REFLECTION_WEIGHT = 1.0;

/** Rank multipliers for prioritization questions. */
const RANK_MULTIPLIERS = [1.0, 0.6, 0.3, 0.1];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function addTraits(target: TraitScores, source: TraitScores, multiplier: number): void {
  for (const [trait, value] of Object.entries(source)) {
    const t = trait as Trait;
    target[t] = (target[t] ?? 0) + (value ?? 0) * multiplier;
  }
}

function signalWeight(signalType: "cognitive" | "self-reflection"): number {
  return signalType === "cognitive" ? COGNITIVE_WEIGHT : SELF_REFLECTION_WEIGHT;
}

// ---------------------------------------------------------------------------
// Per-question scoring
// ---------------------------------------------------------------------------

export function scoreQuestion(
  question: AssessmentQuestion,
  answer: AssessmentAnswer,
): QuestionScore {
  const interestDeltas: TraitScores = {};
  const aptitudeDeltas: TraitScores = {};
  const weight = signalWeight(question.signalType);
  let correctness = 1.0;

  switch (question.type) {
    case "number-sequence": {
      if (answer.type !== "numeric") break;
      const exact = answer.value === question.correctAnswer;
      const close =
        question.tolerance !== undefined &&
        question.correctAnswer !== undefined &&
        Math.abs(answer.value - question.correctAnswer) <= question.tolerance;
      correctness = exact ? 1.0 : close ? 0.5 : 0.0;
      addTraits(aptitudeDeltas, question.traitWeights, correctness * weight);
      break;
    }

    case "odd-one-out":
    case "rapid-association": {
      if (answer.type !== "single" || !question.options) break;
      const selected = question.options.find((o) => o.id === answer.optionId);
      correctness = selected?.correct ? 1.0 : 0.0;
      if (selected?.correct) {
        addTraits(interestDeltas, selected.interest, weight);
        addTraits(aptitudeDeltas, selected.aptitude, weight);
      }
      // Even wrong answers: partial credit from traitWeights
      addTraits(aptitudeDeltas, question.traitWeights, correctness * weight * 0.5);
      break;
    }

    case "scenario-judgment":
    case "energy-mapping":
    case "single-select": {
      if (answer.type !== "single" || !question.options) break;
      const selected = question.options.find((o) => o.id === answer.optionId);
      if (selected) {
        addTraits(interestDeltas, selected.interest, weight);
        addTraits(aptitudeDeltas, selected.aptitude, weight);
      }
      // Scenario judgment has no "correct" answer — correctness stays 1.0
      break;
    }

    case "estimation": {
      if (answer.type !== "single" || !question.options) break;
      const selected = question.options.find((o) => o.id === answer.optionId);
      if (selected?.correct) {
        correctness = 1.0;
      } else if (selected?.adjacent) {
        correctness = 0.5;
      } else {
        correctness = 0.15;
      }
      addTraits(aptitudeDeltas, question.traitWeights, correctness * weight);
      break;
    }

    case "prioritization": {
      if (answer.type !== "rank" || !question.options) break;
      for (let i = 0; i < answer.rankedIds.length; i++) {
        const option = question.options.find((o) => o.id === answer.rankedIds[i]);
        const mult = RANK_MULTIPLIERS[i] ?? 0;
        if (option) {
          addTraits(interestDeltas, option.interest, mult * weight);
          addTraits(aptitudeDeltas, option.aptitude, mult * weight);
        }
      }
      break;
    }

    case "flow-state":
    case "discomfort-tolerance":
    case "multi-select": {
      if (answer.type !== "multi" || !question.options) break;
      for (const optionId of answer.optionIds) {
        const option = question.options.find((o) => o.id === optionId);
        if (option) {
          addTraits(interestDeltas, option.interest, weight);
          addTraits(aptitudeDeltas, option.aptitude, weight);
        }
      }
      break;
    }
  }

  return {
    questionId: question.id,
    signalType: question.signalType,
    correctness,
    interestDeltas,
    aptitudeDeltas,
  };
}

// ---------------------------------------------------------------------------
// Section summaries
// ---------------------------------------------------------------------------

function summarizeSection(
  section: AssessmentSection,
  scores: QuestionScore[],
): SectionSummary {
  // Aggregate aptitude deltas for this section
  const combined: TraitScores = {};
  for (const score of scores) {
    addTraits(combined, score.aptitudeDeltas, 1);
    addTraits(combined, score.interestDeltas, 1);
  }

  // Top traits
  const sorted = Object.entries(combined)
    .filter(([, v]) => (v ?? 0) > 0)
    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
    .slice(0, 3)
    .map(([trait, score]) => ({ trait: trait as Trait, score: score ?? 0 }));

  const TRAIT_LABELS: Record<string, string> = {
    physical: "physical coordination",
    creative: "creative instinct",
    analytical: "analytical thinking",
    social: "social intelligence",
    strategic: "strategic thinking",
    patience: "patience and persistence",
    competitive: "competitive drive",
    expressive: "expressive ability",
    technical: "technical aptitude",
    wellness: "wellness orientation",
    naturalistic: "connection with nature",
  };

  const topNames = sorted.slice(0, 2).map((t) => TRAIT_LABELS[t.trait] ?? t.trait);
  const insight =
    topNames.length >= 2
      ? `This section highlighted your ${topNames[0]} and ${topNames[1]}.`
      : topNames.length === 1
        ? `This section highlighted your ${topNames[0]}.`
        : "Signals from this section were broadly distributed.";

  return {
    sectionId: section.id,
    sectionTitle: section.title,
    topTraits: sorted,
    insight,
  };
}

// ---------------------------------------------------------------------------
// Full assessment scoring
// ---------------------------------------------------------------------------

export function scoreAssessment(
  sections: AssessmentSection[],
  answers: AssessmentAnswers,
  elapsedSeconds: number,
): AssessmentResult {
  const allScores: QuestionScore[] = [];
  const sectionSummaries: SectionSummary[] = [];
  const totalInterest: TraitScores = {};
  const totalAptitude: TraitScores = {};

  for (const section of sections) {
    const sectionScores: QuestionScore[] = [];

    for (const question of section.questions) {
      const answer = answers[question.id];
      if (!answer) continue;
      const score = scoreQuestion(question, answer);
      allScores.push(score);
      sectionScores.push(score);
      addTraits(totalInterest, score.interestDeltas, 1);
      addTraits(totalAptitude, score.aptitudeDeltas, 1);
    }

    sectionSummaries.push(summarizeSection(section, sectionScores));
  }

  return {
    answers,
    scores: allScores,
    traitDeltas: { interest: totalInterest, aptitude: totalAptitude },
    sectionSummaries,
    elapsedSeconds,
    completedAt: new Date().toISOString(),
  };
}
