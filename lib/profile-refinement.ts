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

/** Module signals carry 2x the weight of self-report. */
const MODULE_WEIGHT = 2.0;

/**
 * Build a refined profile from discovery answers and module responses.
 * Either input can be null/empty — the profile adapts.
 */
export function buildRefinedProfile(
  answers: DiscoverAnswers | null,
  moduleResponses: ModuleResponse[],
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

  return {
    selfReport,
    moduleSignals: { interest: moduleInterest, aptitude: moduleAptitude },
    moduleHistory: moduleResponses,
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

  // Collect all traits from both sources
  const allTraits = new Set<Trait>();
  for (const source of [
    profile.selfReport.interest,
    profile.selfReport.aptitude,
    profile.moduleSignals.interest,
    profile.moduleSignals.aptitude,
  ]) {
    for (const t of Object.keys(source)) allTraits.add(t as Trait);
  }

  for (const t of allTraits) {
    interest[t] =
      (profile.selfReport.interest[t] ?? 0) +
      MODULE_WEIGHT * (profile.moduleSignals.interest[t] ?? 0);

    aptitude[t] =
      (profile.selfReport.aptitude[t] ?? 0) +
      MODULE_WEIGHT * (profile.moduleSignals.aptitude[t] ?? 0);
  }

  return { interest, aptitude };
}
