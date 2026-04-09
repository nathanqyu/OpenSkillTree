"use client";

interface ProgressHeaderProps {
  sectionIndex: number;
  totalSections: number;
  sectionTitle: string;
  questionIndex: number;
  totalQuestions: number;
  /** Total questions across all sections for overall progress. */
  overallCurrent: number;
  overallTotal: number;
}

export default function ProgressHeader({
  sectionIndex,
  totalSections,
  sectionTitle,
  questionIndex,
  totalQuestions,
  overallCurrent,
  overallTotal,
}: ProgressHeaderProps) {
  const overallPct = Math.round((overallCurrent / overallTotal) * 100);

  return (
    <div className="mb-8">
      {/* Section label */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
          {sectionTitle} &middot; {questionIndex + 1} of {totalQuestions}
        </span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          Section {sectionIndex + 1}/{totalSections} &middot; {overallPct}%
        </span>
      </div>

      {/* Overall progress bar */}
      <div className="h-1 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-1 rounded-full bg-indigo-500 transition-all duration-300 dark:bg-indigo-400"
          style={{ width: `${overallPct}%` }}
        />
      </div>

      {/* Section progress (dots) */}
      <div className="mt-2 flex gap-1">
        {Array.from({ length: totalSections }).map((_, i) => (
          <div
            key={i}
            className={[
              "h-1 flex-1 rounded-full transition-colors",
              i < sectionIndex
                ? "bg-indigo-500 dark:bg-indigo-400"
                : i === sectionIndex
                  ? "bg-indigo-300 dark:bg-indigo-600"
                  : "bg-zinc-200 dark:bg-zinc-800",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
