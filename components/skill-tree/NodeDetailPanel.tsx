"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  SkillNode,
  SkillEdge,
  SkillBenchmark,
  BenchmarkResource,
  EvidenceRequirement,
  AssessmentMethod,
  EphemeralProgressMap,
  EphemeralLevelMap,
  BenchmarkLevelValue,
  UserProgressStatus,
} from "@/types/skill-tree";
import {
  EVIDENCE_TYPE_LABELS,
  SIGNAL_LABELS,
  ASSESSMENT_METHOD_LABELS,
} from "@/lib/design-tokens";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LEVEL_ORDER: SkillBenchmark["level"][] = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
];

const LEVEL_COLORS: Record<SkillBenchmark["level"], string> = {
  beginner:
    "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  intermediate:
    "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  advanced:
    "bg-violet-50 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
  expert:
    "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
};

const LEVEL_LABELS: Record<SkillBenchmark["level"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

const RESOURCE_ICONS: Record<string, string> = {
  video: "▶",
  article: "📄",
  course: "🎓",
  book: "📖",
  tool: "🔧",
  exercise: "💪",
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface NodeDetailPanelProps {
  nodeId: string | null;
  allNodes: SkillNode[];
  allEdges: SkillEdge[];
  treeId: string;
  progressMap: EphemeralProgressMap;
  levelMap: EphemeralLevelMap;
  onProgressChange: (nodeId: string, status: UserProgressStatus) => void;
  onLevelChange: (nodeId: string, level: BenchmarkLevelValue | null) => void;
  onGraphNavigate: (nodeId: string) => void;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getPrerequisites(
  nodeId: string,
  allNodes: SkillNode[],
  allEdges: SkillEdge[]
): SkillNode[] {
  const prereqIds = allEdges
    .filter((e) => e.targetNodeId === nodeId && e.relationshipType === "requires")
    .map((e) => e.sourceNodeId);
  return allNodes.filter((n) => prereqIds.includes(n.id));
}

function getUnlocks(
  nodeId: string,
  allNodes: SkillNode[],
  allEdges: SkillEdge[]
): SkillNode[] {
  const unlockIds = allEdges
    .filter((e) => e.sourceNodeId === nodeId)
    .map((e) => e.targetNodeId);
  return allNodes.filter((n) => unlockIds.includes(n.id));
}

function isRootNode(nodeId: string, allEdges: SkillEdge[]): boolean {
  return !allEdges.some(
    (e) => e.targetNodeId === nodeId && e.relationshipType === "requires"
  );
}

function getAvailableLevels(benchmarks: SkillBenchmark[]): BenchmarkLevelValue[] {
  return LEVEL_ORDER.filter((l) => benchmarks.some((b) => b.level === l));
}

function getNextLevel(
  currentLevel: BenchmarkLevelValue | null,
  availableLevels: BenchmarkLevelValue[]
): BenchmarkLevelValue | null {
  if (!currentLevel) return availableLevels[0] ?? null;
  const idx = availableLevels.indexOf(currentLevel);
  if (idx === -1 || idx >= availableLevels.length - 1) return null;
  return availableLevels[idx + 1];
}

function deriveProgressStatus(
  currentLevel: BenchmarkLevelValue | null,
  availableLevels: BenchmarkLevelValue[]
): UserProgressStatus {
  if (!currentLevel) return "locked";
  const highestAvailable = availableLevels[availableLevels.length - 1];
  if (currentLevel === highestAvailable) return "completed";
  return "in_progress";
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ResourceLink({ resource }: { resource: BenchmarkResource }) {
  const icon = RESOURCE_ICONS[resource.type ?? "article"] ?? "🔗";
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-500 dark:hover:bg-zinc-700"
    >
      <span className="shrink-0">{icon}</span>
      <span className="min-w-0 flex-1 truncate font-medium text-zinc-900 dark:text-zinc-100">
        {resource.title}
      </span>
      <span className="shrink-0 text-zinc-400">↗</span>
    </a>
  );
}

function EvidenceSection({ evidence }: { evidence: EvidenceRequirement[] }) {
  return (
    <div className="mt-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider opacity-60">
        Evidence of proficiency
      </p>
      <div className="mt-1 space-y-1.5">
        {evidence.map((ev, i) => {
          const signalInfo = SIGNAL_LABELS[ev.signal] ?? SIGNAL_LABELS.contextual;
          return (
            <div key={i} className="rounded-md bg-white/40 px-2.5 py-1.5 dark:bg-black/20">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium opacity-70">
                  {EVIDENCE_TYPE_LABELS[ev.type] ?? ev.type}
                </span>
                <span
                  className={`inline-block rounded-full px-1.5 py-0.5 text-[9px] font-medium ${signalInfo.classes}`}
                >
                  {signalInfo.label}
                </span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed opacity-80">{ev.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AssessmentSection({
  methods,
  notes,
}: {
  methods: AssessmentMethod[];
  notes?: string;
}) {
  return (
    <div className="mt-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider opacity-60">
        Assessment methods
      </p>
      <div className="mt-1 flex flex-wrap gap-1">
        {methods.map((method) => (
          <span
            key={method}
            className="inline-block rounded-full bg-white/40 px-2 py-0.5 text-[10px] font-medium opacity-80 dark:bg-black/20"
          >
            {ASSESSMENT_METHOD_LABELS[method] ?? method}
          </span>
        ))}
      </div>
      {notes && (
        <p className="mt-1.5 text-[10px] italic leading-relaxed opacity-60">
          {notes}
        </p>
      )}
    </div>
  );
}

function BenchmarkCard({ benchmark }: { benchmark: SkillBenchmark }) {
  return (
    <div className={`rounded-lg border p-3 ${LEVEL_COLORS[benchmark.level]}`}>
      <p className="mb-1 text-xs font-semibold capitalize">{benchmark.level}</p>
      <p className="text-xs leading-relaxed">{benchmark.criteria}</p>

      {benchmark.metrics && benchmark.metrics.length > 0 && (
        <ul className="mt-1.5 space-y-0.5">
          {benchmark.metrics.map((m, i) => (
            <li key={i} className="text-xs opacity-80">
              · {m}
            </li>
          ))}
        </ul>
      )}

      {benchmark.evidence && benchmark.evidence.length > 0 && (
        <EvidenceSection evidence={benchmark.evidence} />
      )}

      {benchmark.assessmentMethods && benchmark.assessmentMethods.length > 0 && (
        <AssessmentSection
          methods={benchmark.assessmentMethods}
          notes={benchmark.assessmentNotes}
        />
      )}

      {benchmark.resources && benchmark.resources.length > 0 && (
        <div className="mt-2 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider opacity-60">
            Resources
          </p>
          {benchmark.resources.map((r, i) => (
            <ResourceLink key={i} resource={r} />
          ))}
        </div>
      )}

      {benchmark.practice && benchmark.practice.length > 0 && (
        <div className="mt-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider opacity-60">
            Practice
          </p>
          <ul className="mt-0.5 space-y-0.5">
            {benchmark.practice.map((p, i) => (
              <li key={i} className="text-xs opacity-80">
                → {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {benchmark.projects && benchmark.projects.length > 0 && (
        <div className="mt-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider opacity-60">
            Projects & Milestones
          </p>
          <ul className="mt-0.5 space-y-0.5">
            {benchmark.projects.map((p, i) => (
              <li key={i} className="text-xs opacity-80">
                ◆ {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {benchmark.tips && benchmark.tips.length > 0 && (
        <div className="mt-2 rounded-md bg-amber-50/50 px-2 py-1.5 dark:bg-amber-900/20">
          <p className="text-[10px] font-semibold uppercase tracking-wider opacity-60">
            Tips
          </p>
          <ul className="mt-0.5 space-y-0.5">
            {benchmark.tips.map((t, i) => (
              <li key={i} className="text-xs opacity-80">
                💡 {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function BenchmarkTable({ benchmarks }: { benchmarks: SkillBenchmark[] }) {
  const sorted = [...benchmarks].sort(
    (a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level)
  );

  return (
    <div className="space-y-2">
      {sorted.map((b) => (
        <BenchmarkCard key={b.level} benchmark={b} />
      ))}
    </div>
  );
}

function EmptyBenchmarks() {
  return (
    <div className="rounded-lg border-2 border-dashed border-zinc-200 p-6 text-center dark:border-zinc-700">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        No benchmarks defined yet
      </p>
      <a
        href="https://github.com/OpenSkillTree/openskill-trees/discussions"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-xs text-zinc-400 underline hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
      >
        Help improve this tree →
      </a>
    </div>
  );
}

function NodeLink({
  node,
  onClick,
  badge,
}: {
  node: SkillNode;
  onClick: (id: string) => void;
  badge?: string;
}) {
  const hasBenchmarks = node.benchmarks.length > 0;
  return (
    <button
      onClick={() => onClick(node.id)}
      className="flex w-full items-start gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-left transition-colors hover:border-zinc-400 hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {node.title}
        </p>
        {node.description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
            {node.description}
          </p>
        )}
      </div>
      {badge && (
        <span className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          {badge}
        </span>
      )}
      {!hasBenchmarks && !badge && (
        <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          No benchmarks
        </span>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Level-aware self-assessment
// ---------------------------------------------------------------------------

function LevelAssessment({
  benchmarks,
  currentLevel,
  onLevelChange,
}: {
  benchmarks: SkillBenchmark[];
  currentLevel: BenchmarkLevelValue | null;
  onLevelChange: (level: BenchmarkLevelValue | null) => void;
}) {
  const availableLevels = getAvailableLevels(benchmarks);

  const handleChange = (level: BenchmarkLevelValue | null) => {
    onLevelChange(level);
  };

  const options: { level: BenchmarkLevelValue | null; label: string }[] = [
    { level: null, label: "Not started" },
    ...availableLevels.map((l) => ({ level: l, label: LEVEL_LABELS[l] })),
  ];

  return (
    <div className="rounded-lg bg-zinc-100 p-1.5 dark:bg-zinc-800">
      <p className="mb-1.5 px-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
        Where are you?
      </p>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => {
          const isActive = o.level === currentLevel;
          let cls = "text-zinc-500 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-700";
          if (isActive && o.level === null) {
            cls = "bg-zinc-300 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-100";
          } else if (isActive && o.level === "expert") {
            cls = "bg-emerald-600 text-white";
          } else if (isActive && o.level === "advanced") {
            cls = "bg-violet-600 text-white";
          } else if (isActive && o.level === "intermediate") {
            cls = "bg-blue-600 text-white";
          } else if (isActive && o.level === "beginner") {
            cls = "bg-emerald-500 text-white";
          }
          return (
            <button
              key={o.level ?? "null"}
              onClick={() => handleChange(o.level)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${cls}`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// "What to Do Next" section
// ---------------------------------------------------------------------------

function WhatToDoNext({
  benchmarks,
  currentLevel,
  unlocks,
  onNodeNavigate,
}: {
  benchmarks: SkillBenchmark[];
  currentLevel: BenchmarkLevelValue | null;
  unlocks: SkillNode[];
  onNodeNavigate: (id: string) => void;
}) {
  const availableLevels = getAvailableLevels(benchmarks);
  const nextLevel = getNextLevel(currentLevel, availableLevels);
  const sorted = [...benchmarks].sort(
    (a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level)
  );

  // If not assessed, show first level guidance
  const targetLevel = nextLevel ?? (currentLevel ? null : availableLevels[0] ?? null);
  const targetBenchmark = targetLevel
    ? sorted.find((b) => b.level === targetLevel)
    : null;

  // User has mastered everything — show next skills
  if (currentLevel && !nextLevel) {
    return (
      <section className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-700 dark:bg-emerald-900/20">
        <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
          Mastered!
        </p>
        <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
          You&apos;ve reached the highest level. Explore the next skills to continue growing:
        </p>
        {unlocks.length > 0 && (
          <div className="mt-3 space-y-2">
            {unlocks.map((u) => (
              <NodeLink key={u.id} node={u} onClick={onNodeNavigate} badge="Next" />
            ))}
          </div>
        )}
      </section>
    );
  }

  if (!targetBenchmark) return null;

  const hasContent =
    (targetBenchmark.resources && targetBenchmark.resources.length > 0) ||
    (targetBenchmark.practice && targetBenchmark.practice.length > 0) ||
    (targetBenchmark.projects && targetBenchmark.projects.length > 0) ||
    (targetBenchmark.tips && targetBenchmark.tips.length > 0);

  return (
    <section className="rounded-xl border-2 border-blue-300 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-blue-800 dark:text-blue-300">
          {currentLevel ? `Next up: ${LEVEL_LABELS[targetLevel!]}` : `Get started: ${LEVEL_LABELS[targetLevel!]}`}
        </p>
        {currentLevel && (
          <span className="rounded-full bg-blue-200 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-800 dark:text-blue-300">
            Currently: {LEVEL_LABELS[currentLevel]}
          </span>
        )}
      </div>

      <p className="mt-1.5 text-xs text-blue-700 dark:text-blue-400">
        {targetBenchmark.criteria}
      </p>

      {hasContent ? (
        <div className="mt-3 space-y-3">
          {targetBenchmark.resources && targetBenchmark.resources.length > 0 && (
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Start with these
              </p>
              <div className="space-y-1">
                {targetBenchmark.resources.map((r, i) => (
                  <ResourceLink key={i} resource={r} />
                ))}
              </div>
            </div>
          )}

          {targetBenchmark.practice && targetBenchmark.practice.length > 0 && (
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Practice plan
              </p>
              <ul className="space-y-0.5">
                {targetBenchmark.practice.map((p, i) => (
                  <li key={i} className="text-xs text-blue-800 dark:text-blue-300">
                    → {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {targetBenchmark.projects && targetBenchmark.projects.length > 0 && (
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Build this
              </p>
              <ul className="space-y-0.5">
                {targetBenchmark.projects.map((p, i) => (
                  <li key={i} className="text-xs text-blue-800 dark:text-blue-300">
                    ◆ {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {targetBenchmark.tips && targetBenchmark.tips.length > 0 && (
            <div className="rounded-md bg-amber-50/60 px-2 py-1.5 dark:bg-amber-900/20">
              <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Watch out for
              </p>
              <ul className="space-y-0.5">
                {targetBenchmark.tips.map((t, i) => (
                  <li key={i} className="text-xs text-amber-800 dark:text-amber-300">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-2">
          {targetBenchmark.metrics && targetBenchmark.metrics.length > 0 && (
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Target metrics
              </p>
              <ul className="space-y-0.5">
                {targetBenchmark.metrics.map((m, i) => (
                  <li key={i} className="text-xs text-blue-800 dark:text-blue-300">
                    · {m}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main panel
// ---------------------------------------------------------------------------

export function NodeDetailPanel({
  nodeId,
  allNodes,
  allEdges,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  treeId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  progressMap,
  levelMap,
  onProgressChange,
  onLevelChange,
  onGraphNavigate,
  onClose,
}: NodeDetailPanelProps) {
  const [navHistory, setNavHistory] = useState<string[]>(
    nodeId ? [nodeId] : [],
  );
  const [navIndex, setNavIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Sync history when external node changes (graph click).
  // This is intentional — we need to derive internal state from the nodeId prop.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!nodeId) {
      setVisible(false);
      return;
    }
    setNavHistory([nodeId]);
    setNavIndex(0);
    setDescExpanded(false);
    setVisible(true);
  }, [nodeId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const currentNodeId = navHistory[navIndex] ?? null;
  const node = allNodes.find((n) => n.id === currentNodeId) ?? null;
  const prerequisites = node ? getPrerequisites(node.id, allNodes, allEdges) : [];
  const unlocks = node ? getUnlocks(node.id, allNodes, allEdges) : [];
  const currentLevel: BenchmarkLevelValue | null =
    levelMap[currentNodeId ?? ""] ?? null;
  const isRoot = node ? isRootNode(node.id, allEdges) : false;

  // Progress is now loaded centrally by SkillTreeClient from localStorage.
  // No per-node sessionStorage loading needed.

  // Handle level change — also update progress map
  const handleLevelChange = (level: BenchmarkLevelValue | null) => {
    if (!currentNodeId || !node) return;
    onLevelChange(currentNodeId, level);
    const availableLevels = getAvailableLevels(node.benchmarks);
    const status = deriveProgressStatus(level, availableLevels);
    onProgressChange(currentNodeId, status);
  };

  // Navigate within panel
  const handlePanelNavigate = (targetNodeId: string) => {
    const newHistory = [...navHistory.slice(0, navIndex + 1), targetNodeId];
    setNavHistory(newHistory);
    setNavIndex(newHistory.length - 1);
    onGraphNavigate(targetNodeId);
  };

  const canGoBack = navIndex > 0;
  const canGoForward = navIndex < navHistory.length - 1;

  const goBack = useCallback(() => {
    if (canGoBack) {
      const newIdx = navIndex - 1;
      setNavIndex(newIdx);
      onGraphNavigate(navHistory[newIdx]);
    }
  }, [canGoBack, navIndex, navHistory, onGraphNavigate]);

  const goForward = useCallback(() => {
    if (canGoForward) {
      const newIdx = navIndex + 1;
      setNavIndex(newIdx);
      onGraphNavigate(navHistory[newIdx]);
    }
  }, [canGoForward, navIndex, navHistory, onGraphNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!visible) return;
      if (e.key === "ArrowLeft") goBack();
      if (e.key === "ArrowRight") goForward();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [visible, goBack, goForward, onClose]);

  if (!visible || !node) return null;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={[
          "fixed bottom-0 right-0 z-40 flex flex-col bg-white shadow-2xl",
          "dark:bg-zinc-950 dark:border-l dark:border-zinc-800",
          "w-full md:w-[420px] md:top-0 md:border-l md:border-zinc-200",
          "max-h-[80vh] md:max-h-full md:h-screen",
          "transition-opacity duration-150",
          visible ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
        role="complementary"
        aria-label={`Skill detail: ${node.title}`}
      >
        {/* Sticky header — capped so it never dominates the panel */}
        <div className="shrink-0 max-h-[40vh] overflow-y-auto border-b border-zinc-200 px-4 pt-4 pb-3 dark:border-zinc-800">
          {/* Nav + close */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={goBack}
                disabled={!canGoBack}
                className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                aria-label="Go back"
              >
                ←
              </button>
              <button
                onClick={goForward}
                disabled={!canGoForward}
                className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                aria-label="Go forward"
              >
                →
              </button>
            </div>
            <button
              onClick={onClose}
              className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              aria-label="Close panel"
            >
              ✕
            </button>
          </div>

          {/* Start Here badge for root nodes */}
          {isRoot && currentLevel === null && (
            <div className="mb-2 rounded-md bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              ★ Start here — this is the best place to begin
            </div>
          )}

          <h2 className="text-base font-bold leading-tight text-zinc-900 dark:text-zinc-50">
            {node.title}
          </h2>

          {/* Level-aware self-assessment */}
          <div className="mt-3">
            <LevelAssessment
              benchmarks={node.benchmarks}
              currentLevel={currentLevel}
              onLevelChange={handleLevelChange}
            />
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Description — collapsible */}
          {node.description && (
            <div>
              <p
                className={[
                  "text-sm leading-relaxed text-zinc-500 dark:text-zinc-400",
                  descExpanded ? "" : "line-clamp-3",
                ].join(" ")}
              >
                {node.description}
              </p>
              {node.description.length > 150 && (
                <button
                  onClick={() => setDescExpanded((v) => !v)}
                  className="mt-1 text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                >
                  {descExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}

          {/* What to Do Next — the main action section */}
          <WhatToDoNext
            benchmarks={node.benchmarks}
            currentLevel={currentLevel}
            unlocks={unlocks}
            onNodeNavigate={handlePanelNavigate}
          />

          {/* Benchmarks */}
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              All Levels
            </h3>
            {node.benchmarks.length > 0 ? (
              <BenchmarkTable benchmarks={node.benchmarks} />
            ) : (
              <EmptyBenchmarks />
            )}
          </section>

          {/* Prerequisites */}
          {prerequisites.length > 0 && (
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Prerequisites ({prerequisites.length})
              </h3>
              <div className="space-y-2">
                {prerequisites.map((p) => (
                  <NodeLink key={p.id} node={p} onClick={handlePanelNavigate} />
                ))}
              </div>
            </section>
          )}

          {/* Unlocks / Next skills */}
          {unlocks.length > 0 && (
            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Unlocks ({unlocks.length})
              </h3>
              <div className="space-y-2">
                {unlocks.map((u) => (
                  <NodeLink key={u.id} node={u} onClick={handlePanelNavigate} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
