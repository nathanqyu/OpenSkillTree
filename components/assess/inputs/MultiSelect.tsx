"use client";

import type { AssessmentOption } from "@/types/assessment";

interface MultiSelectProps {
  options: AssessmentOption[];
  selected: string[];
  maxSelections?: number;
  onToggle: (optionId: string) => void;
}

export default function MultiSelect({
  options,
  selected,
  maxSelections,
  onToggle,
}: MultiSelectProps) {
  const atMax = maxSelections !== undefined && selected.length >= maxSelections;

  return (
    <div className="mt-4 space-y-2">
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        const isDisabled = !isSelected && atMax;
        return (
          <button
            key={option.id}
            onClick={() => !isDisabled && onToggle(option.id)}
            disabled={isDisabled}
            className={[
              "w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all",
              isSelected
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                : isDisabled
                  ? "border-zinc-200 text-zinc-300 cursor-not-allowed dark:border-zinc-800 dark:text-zinc-600"
                  : "border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-900",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
