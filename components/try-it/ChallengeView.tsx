"use client";

import type { TryItModule } from "@/types/try-it";

// ---------------------------------------------------------------------------
// Resource type icons
// ---------------------------------------------------------------------------

const RESOURCE_TYPE_LABELS: Record<string, string> = {
  lesson: "Lesson",
  tutorial: "Tutorial",
  course: "Course",
  exercise: "Exercise",
  video: "Video",
  class: "In-Person",
  tool: "Tool",
};

// ---------------------------------------------------------------------------
// Component: external resource launcher + reflection prompts
// ---------------------------------------------------------------------------

interface ChallengeViewProps {
  module: TryItModule;
  onComplete: () => void;
  onBack: () => void;
}

export default function ChallengeView({
  module,
  onComplete,
  onBack,
}: ChallengeViewProps) {
  return (
    <div className="mx-auto max-w-2xl pt-8 pb-20">
      {/* Header */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Try It
      </p>
      <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {module.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {module.description}
      </p>

      {/* External resources */}
      <div className="mt-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Pick a resource to try
        </p>
        {module.resources.map((resource) => (
          <a
            key={resource.url}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-300">
                    {resource.title}
                  </h3>
                  <span className="inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {RESOURCE_TYPE_LABELS[resource.type] ?? resource.type}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {resource.description}
                </p>
              </div>
              <span className="mt-0.5 shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
                ~{resource.estimatedMinutes}m
              </span>
            </div>
            <span className="mt-2 text-xs font-medium text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-400">
              Open resource &rarr;
            </span>
          </a>
        ))}
      </div>

      {/* Reflection prompts */}
      {module.reflectionPrompts.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            While you try it, notice...
          </p>
          <ul className="mt-3 space-y-2">
            {module.reflectionPrompts.map((prompt, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
              >
                <span className="mt-0.5 shrink-0 text-zinc-300 dark:text-zinc-600">
                  {i + 1}.
                </span>
                {prompt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Future vision stub */}
      <div className="mt-8 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
          Coming soon: screen share and video call options for real-time skill
          observation, wearable data integration, and AI-assisted analysis.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors dark:hover:text-zinc-300"
        >
          Back
        </button>
        <button
          onClick={onComplete}
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          I&rsquo;ve Tried It &mdash; Give Feedback
        </button>
      </div>
    </div>
  );
}
