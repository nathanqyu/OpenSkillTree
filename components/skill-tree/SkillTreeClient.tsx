"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type {
  SkillNode,
  SkillEdge,
  EphemeralProgressMap,
  EphemeralLevelMap,
  BenchmarkLevelValue,
  UserProgressStatus,
} from "@/types/skill-tree";
import { SkillTreeGraph } from "./SkillTreeGraph";
import { NodeDetailPanel } from "./NodeDetailPanel";

interface SkillTreeClientProps {
  treeId: string;
  nodes: SkillNode[];
  edges: SkillEdge[];
}

export function SkillTreeClient({ treeId, nodes, edges }: SkillTreeClientProps) {
  const searchParams = useSearchParams();
  const initialNodeId = searchParams.get("node") ?? null;

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialNodeId);
  const [progressMap, setProgressMap] = useState<EphemeralProgressMap>({});
  const [levelMap, setLevelMap] = useState<EphemeralLevelMap>({});

  useEffect(() => {
    setSelectedNodeId(searchParams.get("node") ?? null);
  }, [searchParams]);

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
    []
  );

  const handleLevelChange = useCallback(
    (nodeId: string, level: BenchmarkLevelValue | null) => {
      setLevelMap((prev) => ({ ...prev, [nodeId]: level }));
    },
    []
  );

  const handleClose = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  return (
    <div className="relative">
      <SkillTreeGraph
        nodes={nodes}
        edges={edges}
        selectedNodeId={selectedNodeId}
        progressMap={progressMap}
        onNodeClick={handleNodeClick}
      />
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
    </div>
  );
}
