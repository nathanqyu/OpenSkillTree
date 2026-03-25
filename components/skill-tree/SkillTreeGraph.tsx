"use client";

import { useEffect, useCallback, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import type {
  SkillNode,
  SkillEdge,
  RelationshipType,
  EphemeralProgressMap,
  UserProgressStatus,
} from "@/types/skill-tree";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 76;

const EDGE_COLORS: Record<RelationshipType, string> = {
  requires: "#ef4444",
  enables: "#22c55e",
  "component-of": "#3b82f6",
  complementary: "#a855f7",
  "variant-of": "#f59e0b",
};

const EDGE_LEGEND: { type: RelationshipType; label: string; color: string }[] = [
  { type: "requires", label: "Requires", color: "#ef4444" },
  { type: "enables", label: "Enables", color: "#22c55e" },
  { type: "component-of", label: "Component of", color: "#3b82f6" },
  { type: "complementary", label: "Complementary", color: "#a855f7" },
  { type: "variant-of", label: "Variant of", color: "#f59e0b" },
];

// ---------------------------------------------------------------------------
// Custom node
// ---------------------------------------------------------------------------

interface SkillNodeData {
  label: string;
  benchmarkCount: number;
  pathId: string;
  nodeId: string;
  isSelected: boolean;
  progressStatus: UserProgressStatus;
  isReadyToLearn: boolean;
  isRootNode: boolean;
  onNodeClick: (nodeId: string) => void;
}

const PROGRESS_RING: Record<UserProgressStatus, string> = {
  locked: "",
  in_progress: "ring-2 ring-blue-400 ring-offset-1",
  completed: "ring-2 ring-emerald-500 ring-offset-1",
};

const PROGRESS_BG: Record<UserProgressStatus, string> = {
  locked: "bg-white dark:bg-zinc-900",
  in_progress: "bg-blue-50 dark:bg-blue-950/30",
  completed: "bg-emerald-50 dark:bg-emerald-950/30",
};

function SkillNodeCard({ data }: NodeProps<SkillNodeData>) {
  const selectedCls = data.isSelected
    ? "border-2 border-zinc-800 dark:border-zinc-200 shadow-md"
    : "border border-zinc-200 dark:border-zinc-700 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-500";

  // Ready-to-learn glow for unlocked nodes with completed prerequisites
  const readyGlow =
    data.progressStatus === "locked" && data.isReadyToLearn
      ? "animate-[readyPulse_2s_ease-in-out_infinite]"
      : "";

  return (
    <div
      className={[
        "rounded-lg px-3 py-2.5 cursor-pointer transition-all",
        selectedCls,
        PROGRESS_RING[data.progressStatus],
        PROGRESS_BG[data.progressStatus],
        readyGlow,
      ].join(" ")}
      style={{ width: NODE_WIDTH }}
      onClick={() => data.onNodeClick(data.nodeId)}
    >
      <Handle type="source" position={Position.Top} style={{ background: "#a1a1aa" }} />
      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-2 leading-tight">
        {data.label}
      </p>
      <div className="mt-2 flex items-center gap-1.5">
        {data.progressStatus === "completed" && (
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
            ✓ Mastered
          </span>
        )}
        {data.progressStatus === "in_progress" && (
          <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
            Learning
          </span>
        )}
        {data.progressStatus === "locked" && data.isRootNode && (
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
            ★ Start here
          </span>
        )}
        {data.progressStatus === "locked" && !data.isRootNode && data.isReadyToLearn && (
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            Ready to learn
          </span>
        )}
        {data.progressStatus === "locked" && !data.isRootNode && !data.isReadyToLearn &&
          (data.benchmarkCount > 0 ? (
            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              {data.benchmarkCount} levels
            </span>
          ) : (
            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              No benchmarks
            </span>
          ))}
      </div>
      <Handle type="target" position={Position.Bottom} style={{ background: "#a1a1aa" }} />
    </div>
  );
}

const nodeTypes = { skillNode: SkillNodeCard };

// ---------------------------------------------------------------------------
// ELK layout computation
// ---------------------------------------------------------------------------

async function computeElkLayout(
  skillNodes: SkillNode[],
  skillEdges: SkillEdge[]
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  const ELK = (await import("elkjs/lib/elk.bundled.js")).default;
  const elk = new ELK();

  const elkGraph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "UP",
      "elk.spacing.nodeNode": "40",
      "elk.layered.spacing.nodeNodeBetweenLayers": "80",
      "elk.layered.nodePlacement.strategy": "SIMPLE",
    },
    children: skillNodes.map((node) => ({
      id: node.id,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    })),
    edges: skillEdges.map((edge) => ({
      id: edge.id,
      sources: [edge.sourceNodeId],
      targets: [edge.targetNodeId],
    })),
  };

  const laidOut = await elk.layout(elkGraph);

  const rfNodes: Node[] = (laidOut.children ?? []).map((elkNode) => {
    const skillNode = skillNodes.find((n) => n.id === elkNode.id)!;
    return {
      id: elkNode.id,
      position: { x: elkNode.x ?? 0, y: elkNode.y ?? 0 },
      data: {
        label: skillNode.title,
        benchmarkCount: skillNode.benchmarks.length,
        pathId: skillNode.pathId,
        nodeId: skillNode.id,
        isSelected: false,
        progressStatus: "locked" as UserProgressStatus,
        isReadyToLearn: false,
        isRootNode: false,
        onNodeClick: () => {},
      } satisfies SkillNodeData,
      type: "skillNode",
    };
  });

  const rfEdges: Edge[] = skillEdges.map((edge) => ({
    id: edge.id,
    source: edge.sourceNodeId,
    target: edge.targetNodeId,
    label: edge.relationshipType,
    type: "smoothstep",
    style: { stroke: EDGE_COLORS[edge.relationshipType] ?? "#71717a" },
    labelStyle: { fontSize: 10, fill: "#71717a" },
    labelBgStyle: { fill: "white", fillOpacity: 0.85 },
  }));

  return { nodes: rfNodes, edges: rfEdges };
}

// ---------------------------------------------------------------------------
// Edge color legend overlay
// ---------------------------------------------------------------------------

function EdgeLegend({
  activeTypes,
}: {
  activeTypes: Set<RelationshipType>;
}) {
  const visible = EDGE_LEGEND.filter((l) => activeTypes.has(l.type));
  if (visible.length === 0) return null;

  return (
    <div className="absolute bottom-8 left-2 z-10 rounded-lg border border-zinc-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/90">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
        Edge types
      </p>
      <div className="space-y-1">
        {visible.map((l) => (
          <div key={l.type} className="flex items-center gap-1.5">
            <span
              className="inline-block h-0.5 w-4 rounded"
              style={{ backgroundColor: l.color }}
            />
            <span className="text-[10px] text-zinc-600 dark:text-zinc-400">
              {l.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inner graph
// ---------------------------------------------------------------------------

interface SkillTreeGraphInnerProps {
  skillNodes: SkillNode[];
  skillEdges: SkillEdge[];
  selectedNodeId: string | null;
  progressMap: EphemeralProgressMap;
  onNodeClick: (nodeId: string) => void;
}

function SkillTreeGraphInner({
  skillNodes,
  skillEdges,
  selectedNodeId,
  progressMap,
  onNodeClick,
}: SkillTreeGraphInnerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setCenter } = useReactFlow();

  // Use a ref so the node onClick always calls the latest callback
  // without needing to re-run layout or sync effects
  const onNodeClickRef = useRef(onNodeClick);
  onNodeClickRef.current = onNodeClick;

  const selectedNodeIdRef = useRef(selectedNodeId);
  selectedNodeIdRef.current = selectedNodeId;

  const progressMapRef = useRef(progressMap);
  progressMapRef.current = progressMap;

  // Stable callback that delegates to the ref
  const stableOnNodeClick = useCallback((nodeId: string) => {
    onNodeClickRef.current(nodeId);
  }, []);

  // Compute whether a node is "ready to learn" (all required prerequisites completed)
  const computeNodeFlags = useCallback(
    (nodeId: string, pMap: EphemeralProgressMap) => {
      const prereqs = skillEdges.filter(
        (e) => e.targetNodeId === nodeId && e.relationshipType === "requires"
      );
      const isRoot = !skillEdges.some(
        (e) => e.targetNodeId === nodeId && e.relationshipType === "requires"
      );
      const isReadyToLearn =
        isRoot || prereqs.every((e) => pMap[e.sourceNodeId] === "completed");
      return { isReadyToLearn, isRootNode: isRoot };
    },
    [skillEdges]
  );

  // Initial layout
  useEffect(() => {
    computeElkLayout(skillNodes, skillEdges).then(({ nodes: rfNodes, edges: rfEdges }) => {
      const enriched = rfNodes.map((n) => {
        const flags = computeNodeFlags(n.id, progressMapRef.current);
        return {
          ...n,
          data: {
            ...n.data,
            isSelected: n.id === selectedNodeIdRef.current,
            progressStatus: (progressMapRef.current[n.id] ?? "locked") as UserProgressStatus,
            isReadyToLearn: flags.isReadyToLearn,
            isRootNode: flags.isRootNode,
            onNodeClick: stableOnNodeClick,
          },
        };
      });
      setNodes(enriched);
      setEdges(rfEdges);
    });
  }, [skillNodes, skillEdges, setNodes, setEdges, stableOnNodeClick, computeNodeFlags]);

  // Sync selected + progress state into node data without re-running layout
  useEffect(() => {
    setNodes((prev) =>
      prev.map((n) => {
        const flags = computeNodeFlags(n.id, progressMap);
        return {
          ...n,
          data: {
            ...n.data,
            isSelected: n.id === selectedNodeId,
            progressStatus: (progressMap[n.id] ?? "locked") as UserProgressStatus,
            isReadyToLearn: flags.isReadyToLearn,
            isRootNode: flags.isRootNode,
            onNodeClick: stableOnNodeClick,
          },
        };
      })
    );
  }, [selectedNodeId, progressMap, stableOnNodeClick, setNodes, computeNodeFlags]);

  // Re-center on selected node (300ms animation)
  useEffect(() => {
    if (!selectedNodeId) return;
    const node = nodes.find((n) => n.id === selectedNodeId);
    if (!node) return;
    const cx = node.position.x + NODE_WIDTH / 2;
    const cy = node.position.y + NODE_HEIGHT / 2;
    setCenter(cx, cy, { duration: 300, zoom: 1 });
  }, [selectedNodeId, nodes, setCenter]);

  const activeEdgeTypes = new Set(
    skillEdges.map((e) => e.relationshipType)
  ) as Set<RelationshipType>;

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.25}
        maxZoom={2}
      >
        <Background color="#d4d4d8" gap={20} />
        <Controls />
        <MiniMap nodeColor="#71717a" maskColor="rgba(244,244,245,0.7)" />
      </ReactFlow>
      <EdgeLegend activeTypes={activeEdgeTypes} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------

export interface SkillTreeGraphProps {
  nodes: SkillNode[];
  edges: SkillEdge[];
  selectedNodeId: string | null;
  progressMap: EphemeralProgressMap;
  onNodeClick: (nodeId: string) => void;
}

export function SkillTreeGraph({
  nodes,
  edges,
  selectedNodeId,
  progressMap,
  onNodeClick,
}: SkillTreeGraphProps) {
  return (
    <div
      className="rounded-xl border border-zinc-200 bg-zinc-50 overflow-hidden dark:border-zinc-700 dark:bg-zinc-900 h-[calc(100vh-220px)] min-h-[400px]"
    >
      <ReactFlowProvider>
        <SkillTreeGraphInner
          skillNodes={nodes}
          skillEdges={edges}
          selectedNodeId={selectedNodeId}
          progressMap={progressMap}
          onNodeClick={onNodeClick}
        />
      </ReactFlowProvider>
    </div>
  );
}
