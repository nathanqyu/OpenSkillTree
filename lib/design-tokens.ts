/**
 * Shared design tokens — single source of truth for colors used across components.
 */

/** Domain badge classes: background + text for light and dark modes. */
export const DOMAIN_BADGE: Record<string, string> = {
  Sports:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  Technology:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "Creative Arts":
    "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
  Business:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  Science:
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
};

export const DOMAIN_BADGE_FALLBACK =
  "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";

/** Level labels — canonical display names. */
export const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

/** Evidence type labels — human-readable names. */
export const EVIDENCE_TYPE_LABELS: Record<string, string> = {
  quantitative: "Quantitative",
  demonstration: "Demonstration",
  portfolio: "Portfolio",
  observation: "Observation",
  "self-report": "Self-report",
  "peer-review": "Peer review",
  written: "Written",
  certification: "Certification",
};

/** Signal quality labels and styling. */
export const SIGNAL_LABELS: Record<string, { label: string; classes: string }> = {
  strong: {
    label: "Strong signal",
    classes: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  moderate: {
    label: "Moderate signal",
    classes: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  contextual: {
    label: "Contextual",
    classes: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
};

/** Assessment method labels — human-readable names. */
export const ASSESSMENT_METHOD_LABELS: Record<string, string> = {
  "coach-observation": "Coach observation",
  "video-review": "Video review",
  "timed-test": "Timed test",
  "rubric-evaluation": "Rubric evaluation",
  "peer-assessment": "Peer assessment",
  "self-assessment": "Self-assessment",
  "portfolio-review": "Portfolio review",
  "competition-result": "Competition result",
  "certification-exam": "Certification exam",
  "automated-test": "Automated test",
  "sensor-data": "Sensor data",
  "ai-analysis": "AI analysis",
};
