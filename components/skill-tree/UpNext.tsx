"use client";

import { useMemo } from "react";
import type {
  SkillNode,
  SkillEdge,
  EphemeralProgressMap,
} from "@/types/skill-tree";

interface UpNextProps {
  nodes: SkillNode[];
  edges: SkillEdge[];
  progressMap: EphemeralProgressMap;
  onNodeClick: (nodeId: string) => void;
}

export function UpNext({ nodes, edges, progressMap, onNodeClick }: UpNextProps) {
  const recommendations = useMemo(() => {
    const hasProgress = Object.values(progressMap).some(
      (s) => s === "in_progress" || s === "completed",
    );
    if (!hasProgress) return [];

    // Nodes that are ready (prereqs met) but not yet started
    const ready = nodes.filter((node) => {
      if ((progressMap[node.id] ?? "locked") !== "locked") return false;
      const prereqs = edges.filter(
        (e) =>
          e.targetNodeId === node.id && e.relationshipType === "requires",
      );
      return (
        prereqs.length === 0 ||
        prereqs.every((e) => progressMap[e.sourceNodeId] === "completed")
      );
    });

    // Rank by how many downstream skills they unlock
    return ready
      .map((node) => ({
        node,
        unlockCount: edges.filter((e) => e.sourceNodeId === node.id).length,
        firstResource: node.benchmarks.find((b) => b.level === "beginner")
          ?.resources?.[0],
      }))
      .sort((a, b) => b.unlockCount - a.unlockCount)
      .slice(0, 3);
  }, [nodes, edges, progressMap]);

  // Nothing to recommend (no progress yet, or no ready nodes)
  if (recommendations.length === 0) {
    // Check if everything is done
    const allDone =
      nodes.length > 0 &&
      nodes.every((n) => progressMap[n.id] === "completed");

    if (allDone) {
      return (
        <div className="mb-6 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/30">
          <p className="text-base font-bold text-emerald-800 dark:text-emerald-300">
            Tree mastered!
          </p>
          <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
            You&apos;ve completed every skill in this tree.
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-1 text-sm font-bold text-zinc-900 dark:text-zinc-50">
        Up Next
      </h3>
      <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
        Based on your progress, focus on these next
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {recommendations.map(({ node, unlockCount, firstResource }) => (
          <button
            key={node.id}
            onClick={() => onNodeClick(node.id)}
            className="group flex flex-col rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-left transition-all hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-zinc-800 dark:bg-zinc-800/50 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
          >
            <p className="text-sm font-medium text-zinc-900 line-clamp-1 dark:text-zinc-50">
              {node.title}
            </p>
            {unlockCount > 0 && (
              <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                Unlocks {unlockCount} skill{unlockCount !== 1 ? "s" : ""}
              </p>
            )}
            {firstResource && (
              <p className="mt-auto pt-2 text-[11px] text-emerald-600 line-clamp-1 dark:text-emerald-400">
                Start: {firstResource.title}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
