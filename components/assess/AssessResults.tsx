"use client";

import Link from "next/link";
import type { AssessmentResult } from "@/types/assessment";
import type { TraitScores, SkillRecommendation } from "@/lib/discover-engine";
import { DOMAIN_BADGE, DOMAIN_BADGE_FALLBACK } from "@/lib/design-tokens";
import TraitRadar from "./TraitRadar";

interface AssessResultsProps {
  result: AssessmentResult;
  mergedInterest: TraitScores;
  mergedAptitude: TraitScores;
  recommendations: SkillRecommendation[];
}

export default function AssessResults({
  result,
  mergedInterest,
  mergedAptitude,
  recommendations,
}: AssessResultsProps) {
  const minutes = Math.round(result.elapsedSeconds / 60);
  const cognitiveQuestions = result.scores.filter((s) => s.signalType === "cognitive");
  const avgCorrectness =
    cognitiveQuestions.length > 0
      ? cognitiveQuestions.reduce((sum, s) => sum + s.correctness, 0) /
        cognitiveQuestions.length
      : 0;

  return (
    <div className="mx-auto max-w-2xl pt-8 pb-20">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
        Assessment Complete
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Your Trait Profile
      </h2>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Completed in {minutes} minute{minutes !== 1 ? "s" : ""} &middot;{" "}
        {result.scores.length} questions scored &middot;{" "}
        {Math.round(avgCorrectness * 100)}% cognitive accuracy
      </p>

      {/* Radar chart */}
      <div className="mt-8 flex justify-center">
        <TraitRadar interest={mergedInterest} aptitude={mergedAptitude} />
      </div>

      {/* Section summaries */}
      <div className="mt-8 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Section Insights
        </p>
        {result.sectionSummaries.map((summary) => (
          <div
            key={summary.sectionId}
            className="rounded-xl border border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {summary.sectionTitle}
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {summary.insight}
            </p>
            {summary.topTraits.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {summary.topTraits.map((t) => (
                  <span
                    key={t.trait}
                    className="inline-block rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                  >
                    {t.trait}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Profile update notice */}
      <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-4 dark:border-indigo-900 dark:bg-indigo-900/20">
        <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
          Profile significantly sharpened
        </p>
        <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-400">
          Cognitive task results carry 3x the weight of self-report questions,
          and the assessment overall carries 2.5x weight when merged with your
          discovery profile. Your skill recommendations are now substantially
          more accurate.
        </p>
      </div>

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Your Top Skill Matches
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Based on your combined discovery and deep assessment profile.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {recommendations.slice(0, 6).map((rec) => {
              const domainColor = DOMAIN_BADGE[rec.tree.domain] ?? DOMAIN_BADGE_FALLBACK;
              return (
                <Link
                  key={rec.tree.pathId}
                  href={`/trees/${encodeURIComponent(rec.tree.pathId)}`}
                  className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center gap-2">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${domainColor}`}>
                      {rec.tree.domain}
                    </span>
                    <span className={`text-[10px] font-medium ${
                      rec.category === "strong-match"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : rec.category === "hidden-potential"
                          ? "text-violet-600 dark:text-violet-400"
                          : "text-blue-600 dark:text-blue-400"
                    }`}>
                      {rec.category === "strong-match" ? "Strong Match" : rec.category === "hidden-potential" ? "Hidden Potential" : "Growth Edge"}
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-300">
                    {rec.tree.title}
                  </h4>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-14 text-[10px] text-zinc-400">Interest</span>
                      <div className="h-1 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div className="h-1 rounded-full bg-blue-400 dark:bg-blue-500" style={{ width: `${Math.round(rec.interestScore * 100)}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-14 text-[10px] text-zinc-400">Aptitude</span>
                      <div className="h-1 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div className="h-1 rounded-full bg-emerald-400 dark:bg-emerald-500" style={{ width: `${Math.round(rec.aptitudeScore * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/#explore"
          className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          Browse All Skill Maps
        </Link>
        <Link
          href="/discover?refresh=1"
          className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
        >
          Full Discovery View
        </Link>
      </div>

      <p className="mt-6 text-xs text-zinc-400 dark:text-zinc-600">
        This assessment measures cognitive tendencies and self-reported preferences.
        It is not a validated psychometric instrument. Results improve with additional
        signals from try-it modules and real-world practice.
      </p>
    </div>
  );
}
