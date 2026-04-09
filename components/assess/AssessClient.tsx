"use client";

import { useState, useCallback, useRef } from "react";
import type {
  AssessmentAnswer,
  AssessmentAnswers,
  AssessmentResult,
} from "@/types/assessment";
import { ASSESSMENT_SECTIONS } from "@/lib/assessment-questions";
import { scoreAssessment } from "@/lib/assessment-engine";
import { buildRefinedProfile, getMergedTraitScores } from "@/lib/profile-refinement";
import {
  saveAssessmentResult,
  saveRefinedProfile,
  loadDiscoverAnswers,
  loadModuleResponses,
} from "@/lib/try-it-store";
import {
  generateRecommendationsFromProfile,
  type TraitScores,
  type SkillRecommendation,
} from "@/lib/discover-engine";

import AssessWelcome from "./AssessWelcome";
import SectionIntro from "./SectionIntro";
import ProgressHeader from "./ProgressHeader";
import QuestionRenderer from "./QuestionRenderer";
import AssessResults from "./AssessResults";

// ---------------------------------------------------------------------------
// State Machine
// ---------------------------------------------------------------------------

type Phase = "welcome" | "section-intro" | "question" | "processing" | "results";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const totalQuestions = ASSESSMENT_SECTIONS.reduce(
  (sum, s) => sum + s.questions.length,
  0,
);

function getOverallQuestionIndex(sectionIndex: number, questionIndex: number): number {
  let count = 0;
  for (let i = 0; i < sectionIndex; i++) {
    count += ASSESSMENT_SECTIONS[i].questions.length;
  }
  return count + questionIndex + 1;
}

// ---------------------------------------------------------------------------
// Processing Screen
// ---------------------------------------------------------------------------

function ProcessingScreen() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center pt-32 pb-20 text-center">
      <div className="mb-6 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-indigo-400 dark:bg-indigo-500"
            style={{
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Scoring {totalQuestions} responses across {ASSESSMENT_SECTIONS.length} dimensions...
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section Complete Screen
// ---------------------------------------------------------------------------

function SectionComplete({
  sectionTitle,
  sectionIndex,
  totalSections,
  onContinue,
}: {
  sectionTitle: string;
  sectionIndex: number;
  totalSections: number;
  onContinue: () => void;
}) {
  const isLast = sectionIndex === totalSections - 1;

  return (
    <div className="mx-auto max-w-xl pt-16 pb-20 text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
        Section {sectionIndex + 1} Complete
      </p>
      <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {sectionTitle} \u2014 done.
      </h2>
      <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        {isLast
          ? "That\u2019s all the sections. Let\u2019s see what your brain revealed."
          : `${totalSections - sectionIndex - 1} section${totalSections - sectionIndex - 1 !== 1 ? "s" : ""} remaining.`}
      </p>
      <button
        onClick={onContinue}
        className="mt-8 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
      >
        {isLast ? "See Results" : "Continue"}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Client Component
// ---------------------------------------------------------------------------

export default function AssessClient() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [mergedInterest, setMergedInterest] = useState<TraitScores>({});
  const [mergedAptitude, setMergedAptitude] = useState<TraitScores>({});
  const [recs, setRecs] = useState<SkillRecommendation[]>([]);
  const startTime = useRef(Date.now());

  const currentSection = ASSESSMENT_SECTIONS[sectionIndex];
  const currentQuestion = currentSection?.questions[questionIndex];

  // Welcome → first section intro
  const handleStart = useCallback(() => {
    startTime.current = Date.now();
    setSectionIndex(0);
    setPhase("section-intro");
  }, []);

  // Section intro → first question
  const handleBeginSection = useCallback(() => {
    setQuestionIndex(0);
    setPhase("question");
  }, []);

  // Store answer
  const handleAnswer = useCallback(
    (answer: AssessmentAnswer) => {
      if (!currentQuestion) return;
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
    },
    [currentQuestion],
  );

  // Check if current question has an answer
  const hasAnswer = currentQuestion ? !!answers[currentQuestion.id] : false;

  // Next question or section complete
  const handleNext = useCallback(() => {
    if (!currentSection) return;

    if (questionIndex < currentSection.questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      // Section complete
      if (sectionIndex < ASSESSMENT_SECTIONS.length - 1) {
        // Show section complete, then move to next section intro
        setPhase("section-intro");
        setSectionIndex((i) => i + 1);
      } else {
        // All sections done — score
        setPhase("processing");
        setTimeout(() => {
          const elapsed = Math.round((Date.now() - startTime.current) / 1000);
          const assessResult = scoreAssessment(ASSESSMENT_SECTIONS, answers, elapsed);

          // Save and rebuild profile
          saveAssessmentResult(assessResult);
          const discoverAnswers = loadDiscoverAnswers();
          const moduleResponses = loadModuleResponses();
          const profile = buildRefinedProfile(discoverAnswers, moduleResponses, assessResult);
          saveRefinedProfile(profile);

          const merged = getMergedTraitScores(profile);
          setMergedInterest(merged.interest);
          setMergedAptitude(merged.aptitude);
          setRecs(generateRecommendationsFromProfile(merged.interest, merged.aptitude));
          setResult(assessResult);
          setPhase("results");
        }, 1800);
      }
    }
  }, [questionIndex, sectionIndex, currentSection, answers]);

  // Back within questions
  const handleBack = useCallback(() => {
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    }
  }, [questionIndex]);

  return (
    <>
      {phase === "welcome" && (
        <AssessWelcome sections={ASSESSMENT_SECTIONS} onStart={handleStart} />
      )}

      {phase === "section-intro" && currentSection && (
        <SectionIntro
          section={currentSection}
          sectionIndex={sectionIndex}
          totalSections={ASSESSMENT_SECTIONS.length}
          onBegin={handleBeginSection}
        />
      )}

      {phase === "question" && currentQuestion && currentSection && (
        <div className="mx-auto max-w-2xl pt-8 pb-20">
          <ProgressHeader
            sectionIndex={sectionIndex}
            totalSections={ASSESSMENT_SECTIONS.length}
            sectionTitle={currentSection.title}
            questionIndex={questionIndex}
            totalQuestions={currentSection.questions.length}
            overallCurrent={getOverallQuestionIndex(sectionIndex, questionIndex)}
            overallTotal={totalQuestions}
          />

          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {currentQuestion.title}
          </h2>
          {currentQuestion.subtitle && (
            <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
              {currentQuestion.subtitle}
            </p>
          )}

          <QuestionRenderer
            question={currentQuestion}
            answer={answers[currentQuestion.id] ?? null}
            onAnswer={handleAnswer}
          />

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={questionIndex === 0}
              className={[
                "text-sm transition-colors",
                questionIndex > 0
                  ? "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                  : "text-zinc-200 cursor-not-allowed dark:text-zinc-700",
              ].join(" ")}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!hasAnswer}
              className={[
                "rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                hasAnswer
                  ? "bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                  : "bg-zinc-200 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600",
              ].join(" ")}
            >
              {questionIndex === currentSection.questions.length - 1
                ? sectionIndex === ASSESSMENT_SECTIONS.length - 1
                  ? "Finish"
                  : "Complete Section"
                : "Next"}
            </button>
          </div>
        </div>
      )}

      {phase === "processing" && <ProcessingScreen />}

      {phase === "results" && result && (
        <AssessResults
          result={result}
          mergedInterest={mergedInterest}
          mergedAptitude={mergedAptitude}
          recommendations={recs}
        />
      )}
    </>
  );
}
