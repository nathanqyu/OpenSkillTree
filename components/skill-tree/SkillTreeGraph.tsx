"use client";

import { useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import type { SkillNode, SkillEdge, RelationshipType } from "@/types/skill-tree";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 76;

const EDGE_COLORS: Record<RelationshipType, string> = {
  requires: "#ef4444",
  enables: "#22c55e",
  "component-of": "#3b82f6",
  complementary: "#a855f7",
  "variant-of": "#f59e0b",
};

// ---------------------------------------------------------------------------
// Custom node
// ---------------------------------------------------------------------------

interface SkillNodeData {
  label: string;
  benchmarkCount: number;
  pathId: string;
}

function SkillNodeCard({ data }: NodeProps<SkillNodeData>) {
  return (
    <div
      className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 shadow-sm cursor-pointer hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500 transition-colors"
      style={{ width: NODE_WIDTH }}
      onClick={() => console.log("node clicked:", data.pathId, data)}
    >
      <Handle type="target" position={Position.Top} style={{ background: "#a1a1aa" }} />
      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-2 leading-tight">
        {data.label}
      </p>
      <div className="mt-2 flex items-center gap-1.5">
        {data.benchmarkCount > 0 ? (
          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            {data.benchmarkCount} levels
          </span>
        ) : (
          <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            No benchmarks
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: "#a1a1aa" }} />
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
  // Dynamic import to avoid SSR — elk.bundled.js runs on main thread (fine for <200 nodes)
  const ELK = (await import("elkjs/lib/elk.bundled.js")).default;
  const elk = new ELK();

  const elkGraph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "DOWN",
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
// Inner graph (needs to be inside ReactFlowProvider for useNodesState to work)
// ---------------------------------------------------------------------------

interface SkillTreeGraphInnerProps {
  skillNodes: SkillNode[];
  skillEdges: SkillEdge[];
}

function SkillTreeGraphInner({ skillNodes, skillEdges }: SkillTreeGraphInnerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    computeElkLayout(skillNodes, skillEdges).then(({ nodes: rfNodes, edges: rfEdges }) => {
      setNodes(rfNodes);
      setEdges(rfEdges);
    });
  }, [skillNodes, skillEdges, setNodes, setEdges]);

  return (
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
  );
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------

export interface SkillTreeGraphProps {
  nodes: SkillNode[];
  edges: SkillEdge[];
}

export function SkillTreeGraph({ nodes, edges }: SkillTreeGraphProps) {
  return (
    <div
      style={{ height: 520 }}
      className="rounded-xl border border-zinc-200 bg-zinc-50 overflow-hidden dark:border-zinc-700 dark:bg-zinc-900"
    >
      <ReactFlowProvider>
        <SkillTreeGraphInner skillNodes={nodes} skillEdges={edges} />
      </ReactFlowProvider>
    </div>
  );
}
