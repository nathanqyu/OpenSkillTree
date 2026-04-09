"use client";

import { useState, useCallback } from "react";
import type { ModuleFeedback } from "@/types/try-it";

// ---------------------------------------------------------------------------
// Option Button
// ---------------------------------------------------------------------------

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
        selected
          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
          : "border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-900",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ENJOYMENT_LABELS = [
  "Not at all",
  "A little",
  "It was okay",
  "Enjoyed it",
  "Loved it",
];
const NATURALNESS_LABELS = [
  "Very awkward",
  "A bit forced",
  "Neutral",
  "Fairly natural",
  "Very natural",
];
const RESONANCE_OPTIONS: { value: ModuleFeedback["resonance"]; label: string }[] = [
  { value: "yes", label: "Yes, definitely" },
  { value: "maybe", label: "Maybe" },
  { value: "no", label: "Not really" },
];

interface FeedbackCaptureProps {
  moduleTitle: string;
  onSubmit: (feedback: ModuleFeedback) => void;
  onBack: () => void;
}

export default function FeedbackCapture({
  moduleTitle,
  onSubmit,
  onBack,
}: FeedbackCaptureProps) {
  const [enjoyment, setEnjoyment] = useState<number | null>(null);
  const [naturalness, setNaturalness] = useState<number | null>(null);
  const [resonance, setResonance] = useState<ModuleFeedback["resonance"] | null>(
    null,
  );

  const canSubmit =
    enjoyment !== null && naturalness !== null && resonance !== null;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    onSubmit({
      enjoyment: enjoyment!,
      naturalness: naturalness!,
      resonance: resonance!,
    });
  }, [canSubmit, enjoyment, naturalness, resonance, onSubmit]);

  return (
    <div className="mx-auto max-w-xl pt-8 pb-20">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Quick Feedback
      </p>
      <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        How was {moduleTitle}?
      </h2>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Your responses refine your skill profile. There are no wrong answers.
      </p>

      {/* Enjoyment */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          How much did you enjoy it?
        </h3>
        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          Interest signal — did this feel like something you&rsquo;d choose to do?
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ENJOYMENT_LABELS.map((label, i) => (
            <OptionButton
              key={label}
              label={label}
              selected={enjoyment === i + 1}
              onClick={() => setEnjoyment(i + 1)}
            />
          ))}
        </div>
      </div>

      {/* Naturalness */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          How natural did it feel?
        </h3>
        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          Aptitude signal — did it click quickly, or feel like a struggle?
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {NATURALNESS_LABELS.map((label, i) => (
            <OptionButton
              key={label}
              label={label}
              selected={naturalness === i + 1}
              onClick={() => setNaturalness(i + 1)}
            />
          ))}
        </div>
      </div>

      {/* Resonance */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Could you see yourself doing more of this?
        </h3>
        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          Identity signal — does this feel like &ldquo;you&rdquo;?
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {RESONANCE_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              selected={resonance === opt.value}
              onClick={() => setResonance(opt.value)}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors dark:hover:text-zinc-300"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={[
            "rounded-full px-5 py-2.5 text-sm font-medium transition-all",
            canSubmit
              ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              : "bg-zinc-200 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600",
          ].join(" ")}
        >
          See Results
        </button>
      </div>
    </div>
  );
}
