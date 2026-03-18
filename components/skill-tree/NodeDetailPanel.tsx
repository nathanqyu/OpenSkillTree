"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  SkillNode,
  SkillEdge,
  SkillBenchmark,
  EphemeralProgressMap,
  UserProgressStatus,
} from "@/types/skill-tree";

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

const PROGRESS_LABELS: Record<UserProgressStatus, string> = {
  locked: "Not started",
  in_progress: "In progress",
  completed: "Completed",
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface NodeDetailPanelProps {
  /** Currently selected node ID. null = panel closed. */
  nodeId: string | null;
  allNodes: SkillNode[];
  allEdges: SkillEdge[];
  /** The tree's UUID — used for sessionStorage keys. */
  treeId: string;
  progressMap: EphemeralProgressMap;
  onProgressChange: (nodeId: string, status: UserProgressStatus) => void;
  /** Called when the user navigates to a different node via the panel. */
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

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function BenchmarkTable({ benchmarks }: { benchmarks: SkillBenchmark[] }) {
  const sorted = [...benchmarks].sort(
    (a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level)
  );

  return (
    <div className="space-y-2">
      {sorted.map((b) => (
        <div
          key={b.level}
          className={`rounded-lg border p-3 ${LEVEL_COLORS[b.level]}`}
        >
          <p className="mb-1 text-xs font-semibold capitalize">{b.level}</p>
          <p className="text-xs leading-relaxed">{b.criteria}</p>
          {b.metrics && b.metrics.length > 0 && (
            <ul className="mt-1.5 space-y-0.5">
              {b.metrics.map((m, i) => (
                <li key={i} className="text-xs opacity-80">
                  · {m}
                </li>
              ))}
            </ul>
          )}
        </div>
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
}: {
  node: SkillNode;
  onClick: (id: string) => void;
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
      {!hasBenchmarks && (
        <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          No benchmarks
        </span>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Self-assessment strip
// ---------------------------------------------------------------------------

function SelfAssessmentStrip({
  treeId,
  nodeId,
  currentStatus,
  onStatusChange,
}: {
  treeId: string;
  nodeId: string;
  currentStatus: UserProgressStatus;
  onStatusChange: (status: UserProgressStatus) => void;
}) {
  const storageKey = `ost_level_${treeId}_${nodeId}`;

  // Persist to sessionStorage
  const handleChange = (status: UserProgressStatus) => {
    try {
      sessionStorage.setItem(storageKey, status);
    } catch {
      // SSR / private browsing
    }
    onStatusChange(status);
  };

  const options: { status: UserProgressStatus; label: string; cls: string }[] = [
    {
      status: "locked",
      label: "Not started",
      cls:
        currentStatus === "locked"
          ? "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100"
          : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
    },
    {
      status: "in_progress",
      label: "Learning",
      cls:
        currentStatus === "in_progress"
          ? "bg-blue-600 text-white"
          : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
    },
    {
      status: "completed",
      label: "Mastered",
      cls:
        currentStatus === "completed"
          ? "bg-emerald-600 text-white"
          : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
    },
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
      <span className="mr-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
        Rate yourself:
      </span>
      {options.map((o) => (
        <button
          key={o.status}
          onClick={() => handleChange(o.status)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${o.cls}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main panel
// ---------------------------------------------------------------------------

export function NodeDetailPanel({
  nodeId,
  allNodes,
  allEdges,
  treeId,
  progressMap,
  onProgressChange,
  onGraphNavigate,
  onClose,
}: NodeDetailPanelProps) {
  // Navigation history — internal to panel
  const [navHistory, setNavHistory] = useState<string[]>([]);
  const [navIndex, setNavIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Sync history when external node changes (graph click)
  useEffect(() => {
    if (!nodeId) {
      setVisible(false);
      return;
    }
    setNavHistory([nodeId]);
    setNavIndex(0);
    setVisible(true);
  }, [nodeId]);

  const currentNodeId = navHistory[navIndex] ?? null;
  const node = allNodes.find((n) => n.id === currentNodeId) ?? null;
  const prerequisites = node ? getPrerequisites(node.id, allNodes, allEdges) : [];
  const unlocks = node ? getUnlocks(node.id, allNodes, allEdges) : [];
  const progressStatus: UserProgressStatus = progressMap[currentNodeId ?? ""] ?? "locked";

  // Load persisted self-assessment on node change
  useEffect(() => {
    if (!currentNodeId) return;
    try {
      const saved = sessionStorage.getItem(`ost_level_${treeId}_${currentNodeId}`);
      if (saved && ["locked", "in_progress", "completed"].includes(saved)) {
        onProgressChange(currentNodeId, saved as UserProgressStatus);
      }
    } catch {
      // SSR / private browsing
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeId, treeId]);

  // Navigate within panel (pushes to history)
  const handlePanelNavigate = useCallback(
    (targetNodeId: string) => {
      // Trim forward history then push
      const newHistory = [...navHistory.slice(0, navIndex + 1), targetNodeId];
      setNavHistory(newHistory);
      setNavIndex(newHistory.length - 1);
      onGraphNavigate(targetNodeId);
    },
    [navHistory, navIndex, onGraphNavigate]
  );

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
          // Desktop: right-side drawer
          "fixed bottom-0 right-0 z-40 flex flex-col bg-white shadow-2xl",
          "dark:bg-zinc-950 dark:border-l dark:border-zinc-800",
          // Mobile: full-width bottom sheet
          "w-full md:w-[400px] md:top-0 md:border-l md:border-zinc-200",
          // Mobile height
          "max-h-[80vh] md:max-h-full md:h-screen",
          // Transition
          "transition-opacity duration-150",
          visible ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
        role="complementary"
        aria-label={`Skill detail: ${node.title}`}
      >
        {/* Sticky header */}
        <div className="shrink-0 border-b border-zinc-200 px-4 pt-4 pb-3 dark:border-zinc-800">
          {/* Nav + close row */}
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

          <h2 className="text-base font-bold leading-tight text-zinc-900 dark:text-zinc-50">
            {node.title}
          </h2>
          {node.description && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {node.description}
            </p>
          )}

          {/* Self-assessment — sticky below title */}
          <div className="mt-3">
            <SelfAssessmentStrip
              treeId={treeId}
              nodeId={node.id}
              currentStatus={progressStatus}
              onStatusChange={(s) => onProgressChange(node.id, s)}
            />
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Benchmarks */}
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Benchmarks
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

          {/* Unlocks */}
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
