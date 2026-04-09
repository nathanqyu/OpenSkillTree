"use client";

import type { AssessmentOption } from "@/types/assessment";

interface RankInputProps {
  options: AssessmentOption[];
  ranked: string[];
  maxRank?: number;
  onToggleRank: (optionId: string) => void;
}

/**
 * Click-to-assign-rank interface. Click options in order of preference.
 * First click = rank 1, second click = rank 2, etc.
 * Click a ranked item to remove it and shift others down.
 */
export default function RankInput({
  options,
  ranked,
  maxRank,
  onToggleRank,
}: RankInputProps) {
  const effectiveMax = maxRank ?? options.length;
  const atMax = ranked.length >= effectiveMax;

  return (
    <div className="mt-4 space-y-2">
      {options.map((option) => {
        const rankIndex = ranked.indexOf(option.id);
        const isRanked = rankIndex >= 0;
        const isDisabled = !isRanked && atMax;

        return (
          <button
            key={option.id}
            onClick={() => !isDisabled && onToggleRank(option.id)}
            disabled={isDisabled}
            className={[
              "w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all",
              isRanked
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                : isDisabled
                  ? "border-zinc-200 text-zinc-300 cursor-not-allowed dark:border-zinc-800 dark:text-zinc-600"
                  : "border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-900",
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              {isRanked && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold dark:bg-black/20">
                  {rankIndex + 1}
                </span>
              )}
              <span>{option.label}</span>
            </div>
          </button>
        );
      })}
      {ranked.length > 0 && (
        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          Click a ranked item to remove it. {effectiveMax - ranked.length > 0 ? `${effectiveMax - ranked.length} more to rank.` : "All ranked."}
        </p>
      )}
    </div>
  );
}
