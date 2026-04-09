/**
 * Try-It Module Persistence (localStorage)
 *
 * Follows the same pattern as the existing progress-store:
 * try/catch around all access, silent failures for SSR/private browsing.
 */

import type { DiscoverAnswers } from "@/lib/discover-engine";
import type { ModuleResponse, RefinedProfile } from "@/types/try-it";
import type { AssessmentResult } from "@/types/assessment";

const KEY_RESPONSES = "ost_tryit_responses";
const KEY_PROFILE = "ost_tryit_profile";
const KEY_DISCOVER_ANSWERS = "ost_discover_answers";
const KEY_ASSESSMENT = "ost_assessment_result";

// ---------------------------------------------------------------------------
// Module Responses
// ---------------------------------------------------------------------------

export function loadModuleResponses(): ModuleResponse[] {
  try {
    const raw = localStorage.getItem(KEY_RESPONSES);
    if (!raw) return [];
    return JSON.parse(raw) as ModuleResponse[];
  } catch {
    return [];
  }
}

export function saveModuleResponse(response: ModuleResponse): void {
  try {
    const existing = loadModuleResponses();
    existing.push(response);
    localStorage.setItem(KEY_RESPONSES, JSON.stringify(existing));
  } catch {
    // Silent fail for SSR or private browsing
  }
}

export function hasCompletedModule(moduleId: string): boolean {
  return loadModuleResponses().some((r) => r.moduleId === moduleId);
}

// ---------------------------------------------------------------------------
// Refined Profile
// ---------------------------------------------------------------------------

export function loadRefinedProfile(): RefinedProfile | null {
  try {
    const raw = localStorage.getItem(KEY_PROFILE);
    if (!raw) return null;
    return JSON.parse(raw) as RefinedProfile;
  } catch {
    return null;
  }
}

export function saveRefinedProfile(profile: RefinedProfile): void {
  try {
    localStorage.setItem(KEY_PROFILE, JSON.stringify(profile));
  } catch {
    // Silent fail
  }
}

// ---------------------------------------------------------------------------
// Discover Answers (persisted for profile refinement)
// ---------------------------------------------------------------------------

export function loadDiscoverAnswers(): DiscoverAnswers | null {
  try {
    const raw = localStorage.getItem(KEY_DISCOVER_ANSWERS);
    if (!raw) return null;
    return JSON.parse(raw) as DiscoverAnswers;
  } catch {
    return null;
  }
}

export function saveDiscoverAnswers(answers: DiscoverAnswers): void {
  try {
    localStorage.setItem(KEY_DISCOVER_ANSWERS, JSON.stringify(answers));
  } catch {
    // Silent fail
  }
}

// ---------------------------------------------------------------------------
// Deep Assessment
// ---------------------------------------------------------------------------

export function loadAssessmentResult(): AssessmentResult | null {
  try {
    const raw = localStorage.getItem(KEY_ASSESSMENT);
    if (!raw) return null;
    return JSON.parse(raw) as AssessmentResult;
  } catch {
    return null;
  }
}

export function saveAssessmentResult(result: AssessmentResult): void {
  try {
    localStorage.setItem(KEY_ASSESSMENT, JSON.stringify(result));
  } catch {
    // Silent fail
  }
}

export function hasCompletedAssessment(): boolean {
  try {
    return localStorage.getItem(KEY_ASSESSMENT) !== null;
  } catch {
    return false;
  }
}
