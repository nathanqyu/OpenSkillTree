"use client";

import Link from "next/link";
import type { TryItModule, ModuleResponse } from "@/types/try-it";
import { getModulesForTree } from "@/data/try-it/registry";
import { hasCompletedModule } from "@/lib/try-it-store";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ModuleResultsProps {
  module: TryItModule;
  response: ModuleResponse;
}

export default function ModuleResults({ module, response }: ModuleResultsProps) {
  const feedbackLabels = {
    enjoyment: [
      "",
      "Not at all",
      "A little",
      "It was okay",
      "Enjoyed it",
      "Loved it",
    ],
    naturalness: [
      "",
      "Very awkward",
      "A bit forced",
      "Neutral",
      "Fairly natural",
      "Very natural",
    ],
    resonance: {
      yes: "Yes, definitely",
      maybe: "Maybe",
      no: "Not really",
    },
  };

  // Find next uncompleted module in this tree
  const treeModules = getModulesForTree(module.treePathId);
  const nextModule = treeModules.find(
    (m) => m.id !== module.id && !hasCompletedModule(m.id),
  );

  // Map feedback to signal descriptions
  const interestLevel =
    response.feedback.enjoyment >= 4
      ? "strong interest"
      : response.feedback.enjoyment >= 3
        ? "moderate interest"
        : "low interest";
  const aptitudeLevel =
    response.feedback.naturalness >= 4
      ? "strong aptitude"
      : response.feedback.naturalness >= 3
        ? "moderate aptitude"
        : "developing aptitude";

  return (
    <div className="mx-auto max-w-xl pt-8 pb-20">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Module Complete
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {module.title}
      </h2>

      {/* Signal summary */}
      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Signals Captured
        </p>

        {/* Interest bar */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Interest</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-200">
                {feedbackLabels.enjoyment[response.feedback.enjoyment]}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-1.5 rounded-full bg-blue-400 transition-all duration-500 dark:bg-blue-500"
                style={{
                  width: `${(response.feedback.enjoyment / 5) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Aptitude bar */}
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Aptitude</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-200">
                {feedbackLabels.naturalness[response.feedback.naturalness]}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-1.5 rounded-full bg-emerald-400 transition-all duration-500 dark:bg-emerald-500"
                style={{
                  width: `${(response.feedback.naturalness / 5) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Resonance */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Resonance</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-200">
              {feedbackLabels.resonance[response.feedback.resonance]}
            </span>
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-4 rounded-xl border border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This module suggests{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-200">
            {interestLevel}
          </span>{" "}
          and{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-200">
            {aptitudeLevel}
          </span>{" "}
          in this area.{" "}
          {response.feedback.resonance === "yes"
            ? "Your resonance response suggests this could be a strong fit for continued exploration."
            : response.feedback.resonance === "maybe"
              ? "The more modules you try, the clearer your profile becomes."
              : "Not every skill resonates — that's valuable signal too."}
        </p>
      </div>

      {/* Profile update notice */}
      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 dark:border-emerald-900 dark:bg-emerald-900/20">
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
          Profile updated
        </p>
        <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
          Your discovery profile now includes demonstrated signals from this
          module. These carry more weight than self-report — your recommendations
          will become more accurate as you try more.
        </p>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex flex-wrap gap-3">
        {nextModule && (
          <Link
            href={`/trees/${encodeURIComponent(module.treePathId)}/try-it/${nextModule.id}`}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Try Next: {nextModule.title}
          </Link>
        )}
        <Link
          href={`/trees/${encodeURIComponent(module.treePathId)}`}
          className={[
            "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
            nextModule
              ? "border-zinc-300 text-zinc-700 hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
              : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200",
          ].join(" ")}
        >
          Back to Skill Map
        </Link>
        <Link
          href="/discover"
          className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-500 dark:hover:border-zinc-600"
        >
          Retake Discovery
        </Link>
      </div>

      <p className="mt-6 text-xs text-zinc-400 dark:text-zinc-600">
        Signals are self-reported and approximate. The more modules you try across
        different domains, the more useful your profile becomes.
      </p>
    </div>
  );
}
