"use client";

import { useMemo, useRef, useEffect } from "react";
import type {
  SkillNode,
  SkillEdge,
  EphemeralProgressMap,
  UserProgressStatus,
} from "@/types/skill-tree";

// ---------------------------------------------------------------------------
// Tier computation — topological layering from the prerequisite graph
// ---------------------------------------------------------------------------

interface Tier {
  index: number;
  nodes: SkillNode[];
}

function computeTiers(nodes: SkillNode[], edges: SkillEdge[]): Tier[] {
  // Only requires/enables affect learning order
  const orderEdges = edges.filter(
    (e) =>
      e.relationshipType === "requires" || e.relationshipType === "enables",
  );

  const parents: Record<string, string[]> = {};
  for (const node of nodes) parents[node.id] = [];
  for (const edge of orderEdges) {
    parents[edge.targetNodeId]?.push(edge.sourceNodeId);
  }

  // tier = longest path from any root (ensures nodes aren't placed too early)
  const cache: Record<string, number> = {};

  function depth(id: string, visiting: Set<string>): number {
    if (cache[id] !== undefined) return cache[id];
    if (visiting.has(id)) return 0;
    visiting.add(id);
    const p = parents[id] ?? [];
    cache[id] =
      p.length === 0
        ? 0
        : Math.max(...p.map((pid) => depth(pid, new Set(visiting)))) + 1;
    return cache[id];
  }

  for (const n of nodes) depth(n.id, new Set());

  const map: Record<number, SkillNode[]> = {};
  for (const n of nodes) {
    const t = cache[n.id] ?? 0;
    (map[t] ??= []).push(n);
  }

  return Object.entries(map)
    .sort(([a], [b]) => +a - +b)
    .map(([t, tierNodes]) => ({ index: +t, nodes: tierNodes }));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isReadyToLearn(
  nodeId: string,
  edges: SkillEdge[],
  progressMap: EphemeralProgressMap,
): boolean {
  const prereqs = edges.filter(
    (e) => e.targetNodeId === nodeId && e.relationshipType === "requires",
  );
  return (
    prereqs.length === 0 ||
    prereqs.every((e) => progressMap[e.sourceNodeId] === "completed")
  );
}

// ---------------------------------------------------------------------------
// Level dots
// ---------------------------------------------------------------------------

function LevelDots({
  total,
  status,
}: {
  total: number;
  status: UserProgressStatus;
}) {
  if (total === 0) return null;
  const filled =
    status === "completed" ? total : status === "in_progress" ? 1 : 0;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: Math.min(total, 4) }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            i < filled
              ? status === "completed"
                ? "bg-emerald-500"
                : "bg-blue-500"
              : "bg-zinc-300 dark:bg-zinc-600"
          }`}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Roadmap card
// ---------------------------------------------------------------------------

function RoadmapCard({
  node,
  isRoot,
  isReady,
  progressStatus,
  isSelected,
  onClick,
}: {
  node: SkillNode;
  isRoot: boolean;
  isReady: boolean;
  progressStatus: UserProgressStatus;
  isSelected: boolean;
  onClick: (nodeId: string) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const levels = node.benchmarks.length;

  // Auto-scroll selected card into view
  useEffect(() => {
    if (isSelected && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isSelected]);

  let border: string;
  let bg: string;
  let opacity = "";

  if (isSelected) {
    border = "border-2 border-zinc-800 dark:border-zinc-200 shadow-lg";
    bg = "bg-white dark:bg-zinc-900";
  } else if (progressStatus === "completed") {
    border = "border border-emerald-200 dark:border-emerald-800";
    bg = "bg-emerald-50/50 dark:bg-emerald-950/20";
  } else if (progressStatus === "in_progress") {
    border = "border border-blue-200 dark:border-blue-800";
    bg = "bg-blue-50/50 dark:bg-blue-950/20";
  } else if (isRoot || isReady) {
    border =
      "border border-zinc-200 dark:border-zinc-700 hover:border-emerald-300 dark:hover:border-emerald-700";
    bg = "bg-white dark:bg-zinc-900";
  } else {
    border =
      "border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600";
    bg = "bg-white dark:bg-zinc-900";
    opacity = "opacity-60 hover:opacity-100";
  }

  const glow =
    progressStatus === "locked" && (isRoot || isReady)
      ? "ring-2 ring-emerald-400/40 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950"
      : "";

  return (
    <button
      ref={ref}
      onClick={() => onClick(node.id)}
      className={`group w-full cursor-pointer rounded-xl p-4 text-left transition-all hover:shadow-md ${border} ${bg} ${opacity} ${glow}`}
    >
      {/* Title row */}
      <div className="mb-1 flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold leading-tight text-zinc-900 line-clamp-2 dark:text-zinc-50">
          {node.title}
        </h4>
        {progressStatus === "completed" ? (
          <span className="shrink-0 text-sm text-emerald-500">&#10003;</span>
        ) : (
          <span className="shrink-0 text-xs text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-600">
            &#8594;
          </span>
        )}
      </div>

      {/* Description */}
      {node.description && (
        <p className="mb-3 text-xs leading-relaxed text-zinc-500 line-clamp-2 dark:text-zinc-400">
          {node.description}
        </p>
      )}

      {/* Bottom: dots + badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <LevelDots total={levels} status={progressStatus} />
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            {levels} {levels === 1 ? "level" : "levels"}
          </span>
        </div>

        {progressStatus === "completed" && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
            Mastered
          </span>
        )}
        {progressStatus === "in_progress" && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
            Learning
          </span>
        )}
        {progressStatus === "locked" && isRoot && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
            Start here
          </span>
        )}
        {progressStatus === "locked" && !isRoot && isReady && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            Ready
          </span>
        )}
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export interface SkillTreeRoadmapProps {
  nodes: SkillNode[];
  edges: SkillEdge[];
  selectedNodeId: string | null;
  progressMap: EphemeralProgressMap;
  onNodeClick: (nodeId: string) => void;
}

export function SkillTreeRoadmap({
  nodes,
  edges,
  selectedNodeId,
  progressMap,
  onNodeClick,
}: SkillTreeRoadmapProps) {
  const tiers = useMemo(() => computeTiers(nodes, edges), [nodes, edges]);

  const rootIds = useMemo(() => {
    const targeted = new Set(
      edges
        .filter((e) => e.relationshipType === "requires")
        .map((e) => e.targetNodeId),
    );
    return new Set(nodes.filter((n) => !targeted.has(n.id)).map((n) => n.id));
  }, [nodes, edges]);

  const isTierDone = (tierNodes: SkillNode[]) =>
    tierNodes.length > 0 &&
    tierNodes.every((n) => progressMap[n.id] === "completed");

  return (
    <div className="pb-8">
      {tiers.map(({ index, nodes: tierNodes }, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === tiers.length - 1;
        const done = isTierDone(tierNodes);

        // Step circle color
        const circleCls = isFirst
          ? "bg-emerald-600 text-white"
          : done
            ? "bg-emerald-500 text-white"
            : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300";

        // Connector line color
        const lineCls = done
          ? "bg-emerald-300 dark:bg-emerald-700"
          : "bg-zinc-200 dark:bg-zinc-700";

        const label = isFirst
          ? "Start Here"
          : `Step ${index + 1}`;
        const subtitle = isFirst
          ? "Begin with these foundational skills"
          : isLast && tiers.length > 2
            ? "Advanced skills to reach mastery"
            : "Build on what you\u2019ve learned";

        return (
          <div key={index} className="flex gap-5 md:gap-7">
            {/* ---- Timeline spine (desktop) ---- */}
            <div className="hidden flex-col items-center md:flex">
              {/* Line from above */}
              {!isFirst && <div className={`w-px flex-none h-3 ${lineCls}`} />}
              {/* Step circle */}
              <div
                className={`flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-bold shadow-sm ${circleCls}`}
              >
                {done && !isFirst ? "\u2713" : index + 1}
              </div>
              {/* Line below (stretches to fill) */}
              {!isLast && <div className={`w-px flex-1 ${lineCls}`} />}
            </div>

            {/* ---- Tier content ---- */}
            <div className="min-w-0 flex-1 pb-8">
              {/* Header */}
              <div className="mb-4 flex items-center gap-3">
                {/* Mobile step badge */}
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold md:hidden ${circleCls}`}
                >
                  {done && !isFirst ? "\u2713" : index + 1}
                </span>
                <div>
                  <h3
                    className={`text-base font-bold ${
                      isFirst
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    {label}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {subtitle}
                  </p>
                </div>
              </div>

              {/* Cards — first tier gets wider cards */}
              <div
                className={
                  isFirst
                    ? "grid grid-cols-1 gap-3 sm:grid-cols-2"
                    : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
                }
              >
                {tierNodes.map((node) => (
                  <RoadmapCard
                    key={node.id}
                    node={node}
                    isRoot={rootIds.has(node.id)}
                    isReady={isReadyToLearn(node.id, edges, progressMap)}
                    progressStatus={progressMap[node.id] ?? "locked"}
                    isSelected={selectedNodeId === node.id}
                    onClick={onNodeClick}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
