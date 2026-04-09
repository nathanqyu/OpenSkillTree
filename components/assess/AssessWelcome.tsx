"use client";

import type { AssessmentSection } from "@/types/assessment";

interface AssessWelcomeProps {
  sections: AssessmentSection[];
  onStart: () => void;
}

export default function AssessWelcome({ sections, onStart }: AssessWelcomeProps) {
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);

  return (
    <div className="mx-auto max-w-xl pt-12 pb-20">
      <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
        Deep Assessment
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50 leading-tight">
        What you think you&rsquo;re good at and what you&rsquo;re actually good at aren&rsquo;t always the same thing.
      </h1>
      <p className="mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This assessment combines cognitive tasks &mdash; pattern recognition,
        scenario judgment, estimation &mdash; with structured self-reflection.
        It tests what your brain actually does, not just what you think about yourself.
      </p>

      {/* Section overview */}
      <div className="mt-8 space-y-2">
        {sections.map((section, i) => (
          <div
            key={section.id}
            className="flex items-center gap-3 rounded-lg border border-zinc-100 px-4 py-2.5 dark:border-zinc-800"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {section.title}
              </span>
              <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-500">
                {section.questions.length} questions
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm text-zinc-400 dark:text-zinc-500">
        {sections.length} sections. {totalQuestions} questions. About 20 minutes.
        Your results sharpen your skill discovery profile &mdash; cognitive signals
        carry significantly more weight than self-report.
      </p>

      <button
        onClick={onStart}
        className="mt-8 rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
      >
        Let&rsquo;s Go
      </button>
    </div>
  );
}
