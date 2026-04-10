/**
 * Profile Refinement
 *
 * Merges self-report trait scores (from the discovery questionnaire) with
 * demonstrated signals (from try-it modules). Module signals carry 2x weight
 * because they measure actual behavior, not just stated preference.
 */

import type { TraitScores, Trait, DiscoverAnswers } from "@/lib/discover-engine";
import { buildTraitProfile } from "@/lib/discover-engine";
import type { ModuleResponse, RefinedProfile } from "@/types/try-it";
import type { AssessmentResult } from "@/types/assessment";

/** Module signals carry 2x the weight of self-report. */
const MODULE_WEIGHT = 2.0;
/** Deep assessment signals carry 4x the weight of self-report. */
const ASSESSMENT_WEIGHT = 4.0;

/**
 * Build a refined profile from discovery answers, module responses,
 * and an optional deep assessment result. Any input can be null/empty.
 */
export function buildRefinedProfile(
  answers: DiscoverAnswers | null,
  moduleResponses: ModuleResponse[],
  assessmentResult?: AssessmentResult | null,
): RefinedProfile {
  // Self-report from discovery questionnaire
  let selfReport: { interest: TraitScores; aptitude: TraitScores } = {
    interest: {},
    aptitude: {},
  };
  if (answers && Object.keys(answers).length > 0) {
    selfReport = buildTraitProfile(answers);
  }

  // Accumulate module signals
  const moduleInterest: TraitScores = {};
  const moduleAptitude: TraitScores = {};

  for (const response of moduleResponses) {
    for (const [trait, value] of Object.entries(response.traitDeltas.interest)) {
      const t = trait as Trait;
      moduleInterest[t] = (moduleInterest[t] ?? 0) + (value ?? 0);
    }
    for (const [trait, value] of Object.entries(response.traitDeltas.aptitude)) {
      const t = trait as Trait;
      moduleAptitude[t] = (moduleAptitude[t] ?? 0) + (value ?? 0);
    }
  }

  // Assessment signals
  const assessmentSignals = assessmentResult
    ? { interest: assessmentResult.traitDeltas.interest, aptitude: assessmentResult.traitDeltas.aptitude }
    : undefined;

  return {
    selfReport,
    moduleSignals: { interest: moduleInterest, aptitude: moduleAptitude },
    assessmentSignals,
    moduleHistory: moduleResponses,
    assessmentResult: assessmentResult ?? undefined,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Merge self-report and module signals into final trait vectors.
 * Module signals are weighted 2x (demonstrated > stated).
 */
export function getMergedTraitScores(
  profile: RefinedProfile,
): { interest: TraitScores; aptitude: TraitScores } {
  const interest: TraitScores = {};
  const aptitude: TraitScores = {};

  // Collect all traits from all sources
  const allTraits = new Set<Trait>();
  const sources = [
    profile.selfReport.interest,
    profile.selfReport.aptitude,
    profile.moduleSignals.interest,
    profile.moduleSignals.aptitude,
    ...(profile.assessmentSignals
      ? [profile.assessmentSignals.interest, profile.assessmentSignals.aptitude]
      : []),
  ];
  for (const source of sources) {
    for (const t of Object.keys(source)) allTraits.add(t as Trait);
  }

  for (const t of allTraits) {
    interest[t] =
      (profile.selfReport.interest[t] ?? 0) +
      MODULE_WEIGHT * (profile.moduleSignals.interest[t] ?? 0) +
      ASSESSMENT_WEIGHT * (profile.assessmentSignals?.interest[t] ?? 0);

    aptitude[t] =
      (profile.selfReport.aptitude[t] ?? 0) +
      MODULE_WEIGHT * (profile.moduleSignals.aptitude[t] ?? 0) +
      ASSESSMENT_WEIGHT * (profile.assessmentSignals?.aptitude[t] ?? 0);
  }

  return { interest, aptitude };
}
