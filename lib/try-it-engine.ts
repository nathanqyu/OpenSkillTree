/**
 * Try-It Module Engine
 *
 * Computes trait signal deltas from module feedback. Domain-agnostic —
 * works the same whether the user tried a tennis lesson, a baking tutorial,
 * or a coding exercise.
 *
 * The only inputs are the module's trait profile and the user's feedback
 * (enjoyment, naturalness, resonance). No domain-specific validation.
 */

import type { TraitScores, Trait } from "@/lib/discover-engine";
import type { TryItModule, ModuleFeedback } from "@/types/try-it";

/**
 * Score a completed module and compute trait deltas from feedback.
 *
 * - Enjoyment (1–5) → interest signal
 * - Naturalness (1–5) → aptitude signal
 * - Resonance (yes/maybe/no) → amplifier on interest
 */
export function scoreModule(
  module: TryItModule,
  feedback: ModuleFeedback,
): { traitDeltas: { interest: TraitScores; aptitude: TraitScores } } {
  const interestDeltas: TraitScores = {};
  const aptitudeDeltas: TraitScores = {};

  // Resonance amplifier on interest
  const resonanceMultiplier =
    feedback.resonance === "yes" ? 1.5 : feedback.resonance === "maybe" ? 1.0 : 0.5;

  // Enjoyment → interest (1-5 → 0-1)
  const enjoymentFactor = feedback.enjoyment / 5;

  // Naturalness → aptitude (1-5 → 0-1)
  const naturalnessFactor = feedback.naturalness / 5;

  for (const [trait, weight] of Object.entries(module.traitProfile)) {
    const t = trait as Trait;
    const w = weight ?? 0;

    // Interest delta: trait weight × enjoyment × resonance
    interestDeltas[t] = w * enjoymentFactor * resonanceMultiplier;

    // Aptitude delta: trait weight × naturalness
    aptitudeDeltas[t] = w * naturalnessFactor;
  }

  return {
    traitDeltas: { interest: interestDeltas, aptitude: aptitudeDeltas },
  };
}
