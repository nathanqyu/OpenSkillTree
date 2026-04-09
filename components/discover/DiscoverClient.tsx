"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  DISCOVER_QUESTIONS,
  CATEGORY_META,
  generateRecommendations,
  generateRecommendationsFromProfile,
  type DiscoverQuestion,
  type DiscoverAnswers,
  type SkillRecommendation,
  type RecommendationCategory,
} from "@/lib/discover-engine";
import { DOMAIN_BADGE, DOMAIN_BADGE_FALLBACK } from "@/lib/design-tokens";
import {
  saveDiscoverAnswers,
  loadDiscoverAnswers,
  loadModuleResponses,
  loadAssessmentResult,
} from "@/lib/try-it-store";
import { buildRefinedProfile, getMergedTraitScores } from "@/lib/profile-refinement";

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

type Phase = "welcome" | "questions" | "processing" | "results";

// ---------------------------------------------------------------------------
// Welcome Screen
// ---------------------------------------------------------------------------

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto max-w-xl pt-12 pb-20">
      <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Skill Discovery
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50 leading-tight">
        Find skills you didn&rsquo;t know you&rsquo;d be good at.
      </h1>
      <p className="mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        A short exploration of your natural tendencies, interests, and strengths
        &mdash; mapped against structured skill progressions across dozens of domains.
      </p>
      <p className="mt-3 text-sm text-zinc-400 dark:text-zinc-500">
        8 questions. Takes about 2 minutes. This is not a personality test &mdash; it&rsquo;s
        a structured starting point for exploration.
      </p>
      <button
        onClick={onStart}
        className="mt-8 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Begin Exploration
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Question Screen
// ---------------------------------------------------------------------------

function QuestionScreen({
  question,
  questionIndex,
  totalQuestions,
  selected,
  onSelect,
  onNext,
  onBack,
}: {
  question: DiscoverQuestion;
  questionIndex: number;
  totalQuestions: number;
  selected: string[];
  onSelect: (optionId: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const canProceed = selected.length > 0;
  const atMax =
    question.type === "multi" &&
    question.maxSelections !== undefined &&
    selected.length >= question.maxSelections;

  return (
    <div className="mx-auto max-w-xl pt-8 pb-20">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
          <span>
            {questionIndex + 1} of {totalQuestions}
          </span>
          <span>{Math.round(((questionIndex + 1) / totalQuestions) * 100)}%</span>
        </div>
        <div className="h-1 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-1 rounded-full bg-zinc-900 transition-all duration-300 dark:bg-zinc-50"
            style={{
              width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {question.title}
      </h2>
      {question.subtitle && (
        <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
          {question.subtitle}
        </p>
      )}

      {/* Options */}
      <div className="mt-6 space-y-2">
        {question.options.map((option) => {
          const isSelected = selected.includes(option.id);
          const isDisabled = !isSelected && atMax;
          return (
            <button
              key={option.id}
              onClick={() => !isDisabled && onSelect(option.id)}
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

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors dark:hover:text-zinc-300"
        >
          {questionIndex === 0 ? "Back to start" : "Previous"}
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={[
            "rounded-full px-5 py-2.5 text-sm font-medium transition-all",
            canProceed
              ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              : "bg-zinc-200 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600",
          ].join(" ")}
        >
          {questionIndex === totalQuestions - 1 ? "See Results" : "Next"}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Processing Screen
// ---------------------------------------------------------------------------

function ProcessingScreen() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center pt-32 pb-20 text-center">
      {/* Animated dots */}
      <div className="mb-6 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500"
            style={{
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Mapping your profile against {18} skill progressions...
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Results Screen
// ---------------------------------------------------------------------------

function RecommendationCard({
  rec,
}: {
  rec: SkillRecommendation;
}) {
  const domainColor = DOMAIN_BADGE[rec.tree.domain] ?? DOMAIN_BADGE_FALLBACK;

  return (
    <Link
      href={`/trees/${encodeURIComponent(rec.tree.pathId)}`}
      className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="mb-3 flex items-start gap-2">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${domainColor}`}
        >
          {rec.tree.domain}
        </span>
      </div>
      <h3 className="text-base font-semibold text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-300">
        {rec.tree.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
        {rec.reasoning}
      </p>

      {/* Score bars */}
      <div className="mt-4 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-16 text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
            Interest
          </span>
          <div className="h-1.5 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-1.5 rounded-full bg-blue-400 transition-all duration-500 dark:bg-blue-500"
              style={{ width: `${Math.round(rec.interestScore * 100)}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-16 text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
            Aptitude
          </span>
          <div className="h-1.5 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-1.5 rounded-full bg-emerald-400 transition-all duration-500 dark:bg-emerald-500"
              style={{ width: `${Math.round(rec.aptitudeScore * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

function CategorySection({
  category,
  recommendations,
}: {
  category: RecommendationCategory;
  recommendations: SkillRecommendation[];
}) {
  if (recommendations.length === 0) return null;
  const meta = CATEGORY_META[category];

  const categoryBorder: Record<RecommendationCategory, string> = {
    "strong-match": "border-l-emerald-500",
    "hidden-potential": "border-l-violet-500",
    "growth-edge": "border-l-blue-500",
  };

  return (
    <section className={`border-l-4 pl-5 ${categoryBorder[category]}`}>
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {meta.label}
      </h3>
      <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
        {meta.description}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((rec) => (
          <RecommendationCard key={rec.tree.pathId} rec={rec} />
        ))}
      </div>
    </section>
  );
}

function ResultsScreen({
  recommendations,
  onRetake,
}: {
  recommendations: SkillRecommendation[];
  onRetake: () => void;
}) {
  const strong = recommendations.filter((r) => r.category === "strong-match");
  const hidden = recommendations.filter((r) => r.category === "hidden-potential");
  const growth = recommendations.filter((r) => r.category === "growth-edge");

  return (
    <div className="mx-auto max-w-4xl pt-8 pb-20">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Your results
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Your skill map
      </h2>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Based on your responses, here are the skill progressions most aligned
        with your profile. Click any recommendation to explore its full skill map.
      </p>

      <div className="mt-10 space-y-10">
        <CategorySection category="strong-match" recommendations={strong} />
        <CategorySection category="hidden-potential" recommendations={hidden} />
        <CategorySection category="growth-edge" recommendations={growth} />
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <button
          onClick={onRetake}
          className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
        >
          Retake
        </button>
        <Link
          href="/#explore"
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Browse All Skill Maps
        </Link>
      </div>

      {/* Deep Assessment CTA */}
      <div className="mt-8 rounded-xl border border-indigo-200 bg-indigo-50 px-6 py-5 dark:border-indigo-900 dark:bg-indigo-900/20">
        <p className="text-base font-semibold text-indigo-900 dark:text-indigo-200">
          Your profile has blind spots. Everyone&rsquo;s does.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-indigo-700 dark:text-indigo-300">
          The discovery questions capture what you think about yourself.
          The Deep Assessment tests what your brain actually does &mdash;
          pattern recognition, judgment under ambiguity, where your
          energy really goes. 20 minutes. You&rsquo;ll learn something
          you didn&rsquo;t expect.
        </p>
        <Link
          href="/assess"
          className="mt-4 inline-block rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          Sharpen Your Profile
        </Link>
      </div>

      {/* Try-it module CTA */}
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-900 dark:bg-amber-900/20">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
          Or try a skill hands-on
        </p>
        <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
          Click into any skill map above and look for &ldquo;Try It&rdquo; modules
          to add real-world experience signals to your profile.
        </p>
      </div>

      <p className="mt-6 text-xs text-zinc-400 dark:text-zinc-600">
        This is a structured exploration tool, not a scientific assessment. Recommendations
        are based on trait alignment with skill progressions and are meant as a starting point.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Client Component
// ---------------------------------------------------------------------------

export default function DiscoverClient() {
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<Phase>("welcome");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<DiscoverAnswers>({});
  const [recommendations, setRecommendations] = useState<SkillRecommendation[]>(
    [],
  );

  const currentQuestion = DISCOVER_QUESTIONS[questionIndex];

  // Auto-refresh: if ?refresh=1 and we have saved answers, jump straight to results
  useEffect(() => {
    if (searchParams.get("refresh") !== "1") return;
    const saved = loadDiscoverAnswers();
    if (!saved || Object.keys(saved).length === 0) return;

    const moduleResponses = loadModuleResponses();
    const assessmentResult = loadAssessmentResult();
    let recs: SkillRecommendation[];

    if (moduleResponses.length > 0 || assessmentResult) {
      const profile = buildRefinedProfile(saved, moduleResponses, assessmentResult);
      const merged = getMergedTraitScores(profile);
      recs = generateRecommendationsFromProfile(merged.interest, merged.aptitude);
    } else {
      recs = generateRecommendations(saved);
    }

    setAnswers(saved);
    setRecommendations(recs);
    setPhase("results");
  }, [searchParams]);

  const handleStart = useCallback(() => {
    setPhase("questions");
    setQuestionIndex(0);
    setAnswers({});
  }, []);

  const handleSelect = useCallback(
    (optionId: string) => {
      const qId = currentQuestion.id;
      setAnswers((prev) => {
        const current = prev[qId] ?? [];
        if (currentQuestion.type === "single") {
          return { ...prev, [qId]: [optionId] };
        }
        // Multi-select: toggle
        if (current.includes(optionId)) {
          return { ...prev, [qId]: current.filter((id) => id !== optionId) };
        }
        return { ...prev, [qId]: [...current, optionId] };
      });
    },
    [currentQuestion],
  );

  const handleNext = useCallback(() => {
    if (phase === "processing") return;
    if (questionIndex < DISCOVER_QUESTIONS.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      // Last question → processing → results
      setPhase("processing");
      setTimeout(() => {
        // Persist answers for future profile refinement
        saveDiscoverAnswers(answers);

        // Check for module signals and assessment results
        const moduleResponses = loadModuleResponses();
        const assessmentResult = loadAssessmentResult();
        let recs: SkillRecommendation[];

        if (moduleResponses.length > 0 || assessmentResult) {
          // Merge self-report with demonstrated signals
          const profile = buildRefinedProfile(answers, moduleResponses, assessmentResult);
          const merged = getMergedTraitScores(profile);
          recs = generateRecommendationsFromProfile(merged.interest, merged.aptitude);
        } else {
          recs = generateRecommendations(answers);
        }

        setRecommendations(recs);
        setPhase("results");
      }, 1500);
    }
  }, [questionIndex, answers, phase]);

  const handleBack = useCallback(() => {
    if (questionIndex === 0) {
      setPhase("welcome");
    } else {
      setQuestionIndex((i) => i - 1);
    }
  }, [questionIndex]);

  const handleRetake = useCallback(() => {
    setPhase("welcome");
    setQuestionIndex(0);
    setAnswers({});
    setRecommendations([]);
  }, []);

  return (
    <>
      {phase === "welcome" && <WelcomeScreen onStart={handleStart} />}
      {phase === "questions" && currentQuestion && (
        <QuestionScreen
          question={currentQuestion}
          questionIndex={questionIndex}
          totalQuestions={DISCOVER_QUESTIONS.length}
          selected={answers[currentQuestion.id] ?? []}
          onSelect={handleSelect}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {phase === "processing" && <ProcessingScreen />}
      {phase === "results" && (
        <ResultsScreen
          recommendations={recommendations}
          onRetake={handleRetake}
        />
      )}
    </>
  );
}
