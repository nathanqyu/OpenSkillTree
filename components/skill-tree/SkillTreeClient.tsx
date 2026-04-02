"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type {
  SkillNode,
  SkillEdge,
  SkillBenchmark,
  EphemeralProgressMap,
  EphemeralLevelMap,
  BenchmarkLevelValue,
  UserProgressStatus,
} from "@/types/skill-tree";
import { loadProgress, saveNodeLevel } from "@/lib/progress-store";
import { LEVEL_LABELS } from "@/lib/design-tokens";
import { useToast, ToastContainer } from "@/components/ui/LevelUpToast";
import { SkillTreeRoadmap } from "./SkillTreeRoadmap";
import { UpNext } from "./UpNext";
import { NodeDetailPanel } from "./NodeDetailPanel";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const LEVEL_ORDER: BenchmarkLevelValue[] = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
];

function deriveStatus(
  level: BenchmarkLevelValue | null,
  benchmarks: SkillBenchmark[],
): UserProgressStatus {
  if (!level) return "locked";
  const available = LEVEL_ORDER.filter((l) =>
    benchmarks.some((b) => b.level === l),
  );
  return level === available[available.length - 1] ? "completed" : "in_progress";
}

function isLevelUp(
  prev: BenchmarkLevelValue | null,
  next: BenchmarkLevelValue | null,
): boolean {
  if (!next || !prev) return false;
  return LEVEL_ORDER.indexOf(next) > LEVEL_ORDER.indexOf(prev);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface SkillTreeClientProps {
  treeId: string;
  treeMeta: { pathId: string; title: string; domain: string };
  nodes: SkillNode[];
  edges: SkillEdge[];
}

export function SkillTreeClient({
  treeId,
  treeMeta,
  nodes,
  edges,
}: SkillTreeClientProps) {
  const searchParams = useSearchParams();
  const initialNodeId = searchParams.get("node") ?? null;

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    initialNodeId,
  );
  const [progressMap, setProgressMap] = useState<EphemeralProgressMap>({});
  const [levelMap, setLevelMap] = useState<EphemeralLevelMap>({});
  const levelMapRef = useRef(levelMap);
  levelMapRef.current = levelMap;

  const { toasts, show: showToast } = useToast();

  // Sync with URL param
  useEffect(() => {
    setSelectedNodeId(searchParams.get("node") ?? null);
  }, [searchParams]);

  // Load persisted progress from localStorage on mount
  useEffect(() => {
    const saved = loadProgress(treeId);
    if (!saved) return;

    const newLevelMap: EphemeralLevelMap = {};
    const newProgressMap: EphemeralProgressMap = {};

    for (const [nodeId, level] of Object.entries(saved.levels)) {
      newLevelMap[nodeId] = level;
      if (level) {
        const node = nodes.find((n) => n.id === nodeId);
        if (node) {
          newProgressMap[nodeId] = deriveStatus(level, node.benchmarks);
        }
      }
    }

    setLevelMap(newLevelMap);
    setProgressMap(newProgressMap);
  }, [treeId, nodes]);

  // ------ Handlers ----------------------------------------------------------

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
  }, []);

  const handleGraphNavigate = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleProgressChange = useCallback(
    (nodeId: string, status: UserProgressStatus) => {
      setProgressMap((prev) => ({ ...prev, [nodeId]: status }));
    },
    [],
  );

  const handleLevelChange = useCallback(
    (nodeId: string, level: BenchmarkLevelValue | null) => {
      const prevLevel = levelMapRef.current[nodeId] ?? null;
      setLevelMap((prev) => ({ ...prev, [nodeId]: level }));
      saveNodeLevel(treeId, treeMeta, nodeId, level, nodes.length);

      // Celebrate level-ups
      if (isLevelUp(prevLevel, level)) {
        const node = nodes.find((n) => n.id === nodeId);
        if (node && level) {
          showToast(
            `Level up! ${LEVEL_LABELS[level]}`,
            node.title,
          );
        }
      }
    },
    [treeId, treeMeta, nodes, showToast],
  );

  const handleClose = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // ------ Progress summary --------------------------------------------------

  const hasProgress = useMemo(
    () =>
      Object.values(progressMap).some(
        (s) => s === "in_progress" || s === "completed",
      ),
    [progressMap],
  );

  const assessed = useMemo(
    () =>
      Object.values(levelMap).filter((l) => l !== null && l !== undefined)
        .length,
    [levelMap],
  );

  const pct =
    nodes.length > 0 ? Math.round((assessed / nodes.length) * 100) : 0;

  // ------ Render ------------------------------------------------------------

  return (
    <div className="relative">
      <div
        className={`transition-[padding] duration-200 ${selectedNodeId ? "md:pr-[440px]" : ""}`}
      >
        {/* Progress bar (only when user has started) */}
        {hasProgress && (
          <div className="mb-4 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900/60">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Your Progress
              </span>
              <span className="text-xs text-zinc-500">
                {assessed}/{nodes.length} skills &middot; {pct}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="h-1.5 rounded-full bg-emerald-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Personalised next-skills */}
        <UpNext
          nodes={nodes}
          edges={edges}
          progressMap={progressMap}
          onNodeClick={handleNodeClick}
        />

        {/* Roadmap */}
        <SkillTreeRoadmap
          nodes={nodes}
          edges={edges}
          selectedNodeId={selectedNodeId}
          progressMap={progressMap}
          onNodeClick={handleNodeClick}
        />
      </div>

      <NodeDetailPanel
        nodeId={selectedNodeId}
        allNodes={nodes}
        allEdges={edges}
        treeId={treeId}
        progressMap={progressMap}
        levelMap={levelMap}
        onProgressChange={handleProgressChange}
        onLevelChange={handleLevelChange}
        onGraphNavigate={handleGraphNavigate}
        onClose={handleClose}
      />

      {/* Level-up celebrations */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
