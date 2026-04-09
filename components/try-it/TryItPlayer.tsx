"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { TryItModule, ModuleFeedback, ModuleResponse } from "@/types/try-it";
import { scoreModule } from "@/lib/try-it-engine";
import { buildRefinedProfile } from "@/lib/profile-refinement";
import {
  saveModuleResponse,
  loadModuleResponses,
  saveRefinedProfile,
  loadDiscoverAnswers,
} from "@/lib/try-it-store";
import ChallengeView from "./ChallengeView";
import FeedbackCapture from "./FeedbackCapture";
import ModuleResults from "./ModuleResults";

// ---------------------------------------------------------------------------
// State Machine
// ---------------------------------------------------------------------------

type Phase = "intro" | "try" | "feedback" | "results";

// ---------------------------------------------------------------------------
// Intro Screen
// ---------------------------------------------------------------------------

function IntroScreen({
  module,
  onStart,
  onBack,
}: {
  module: TryItModule;
  onStart: () => void;
  onBack: () => void;
}) {
  const totalTime = module.resources.reduce(
    (sum, r) => Math.max(sum, r.estimatedMinutes),
    0,
  );

  return (
    <div className="mx-auto max-w-xl pt-12 pb-20">
      <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Try-It Module
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50 leading-tight">
        {module.title}
      </h1>
      <p className="mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        {module.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        <span>{module.resources.length} resource{module.resources.length !== 1 ? "s" : ""} to choose from</span>
        <span>&middot;</span>
        <span>~{totalTime} minutes</span>
      </div>

      <p className="mt-6 text-sm text-zinc-400 dark:text-zinc-500">
        You&rsquo;ll try an external resource, then answer 3 quick questions about
        your experience. Your responses update your skill discovery profile &mdash;
        demonstrated signals carry more weight than self-report.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={onStart}
          className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Get Started
        </button>
        <Link
          href={`/trees/${encodeURIComponent(module.treePathId)}`}
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
          className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors dark:hover:text-zinc-300"
        >
          Back to skill map
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Orchestrator
// ---------------------------------------------------------------------------

export default function TryItPlayer({ module }: { module: TryItModule }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [response, setResponse] = useState<ModuleResponse | null>(null);

  const handleStart = useCallback(() => {
    setPhase("try");
  }, []);

  const handleTryComplete = useCallback(() => {
    setPhase("feedback");
  }, []);

  const handleFeedback = useCallback(
    (feedback: ModuleFeedback) => {
      // Score the module
      const { traitDeltas } = scoreModule(module, feedback);

      // Build response
      const moduleResponse: ModuleResponse = {
        moduleId: module.id,
        treePathId: module.treePathId,
        nodePathId: module.nodePathId,
        feedback,
        traitDeltas,
        completedAt: new Date().toISOString(),
      };

      // Persist
      saveModuleResponse(moduleResponse);

      // Rebuild and save refined profile
      const answers = loadDiscoverAnswers();
      const allResponses = loadModuleResponses();
      const profile = buildRefinedProfile(answers, allResponses);
      saveRefinedProfile(profile);

      setResponse(moduleResponse);
      setPhase("results");
    },
    [module],
  );

  const handleBack = useCallback(() => {
    if (phase === "try") setPhase("intro");
    else if (phase === "feedback") setPhase("try");
  }, [phase]);

  return (
    <>
      {phase === "intro" && (
        <IntroScreen
          module={module}
          onStart={handleStart}
          onBack={() => window.history.back()}
        />
      )}
      {phase === "try" && (
        <ChallengeView
          module={module}
          onComplete={handleTryComplete}
          onBack={handleBack}
        />
      )}
      {phase === "feedback" && (
        <FeedbackCapture
          moduleTitle={module.title}
          onSubmit={handleFeedback}
          onBack={handleBack}
        />
      )}
      {phase === "results" && response && (
        <ModuleResults module={module} response={response} />
      )}
    </>
  );
}
