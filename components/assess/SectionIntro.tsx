"use client";

import type { AssessmentSection } from "@/types/assessment";

interface SectionIntroProps {
  section: AssessmentSection;
  sectionIndex: number;
  totalSections: number;
  onBegin: () => void;
}

export default function SectionIntro({
  section,
  sectionIndex,
  totalSections,
  onBegin,
}: SectionIntroProps) {
  return (
    <div className="mx-auto max-w-xl pt-12 pb-20">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Section {sectionIndex + 1} of {totalSections}
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {section.title}
      </h2>
      <p className="mt-1 text-sm text-indigo-500 dark:text-indigo-400">
        {section.subtitle}
      </p>
      <p className="mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        {section.intro}
      </p>
      <p className="mt-3 text-sm text-zinc-400 dark:text-zinc-500">
        {section.questions.length} questions in this section.
      </p>
      <button
        onClick={onBegin}
        className="mt-8 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
      >
        Begin
      </button>
    </div>
  );
}
