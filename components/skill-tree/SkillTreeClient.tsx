"use client";

import { useState, useCallback } from "react";
import type { SkillNode, SkillEdge, EphemeralProgressMap, UserProgressStatus } from "@/types/skill-tree";
import { SkillTreeGraph } from "./SkillTreeGraph";
import { NodeDetailPanel } from "./NodeDetailPanel";

interface SkillTreeClientProps {
  treeId: string;
  nodes: SkillNode[];
  edges: SkillEdge[];
}

export function SkillTreeClient({ treeId, nodes, edges }: SkillTreeClientProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<EphemeralProgressMap>({});

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
        onProgressChange={handleProgressChange}
        onGraphNavigate={handleGraphNavigate}
        onClose={handleClose}
      />
    </div>
  );
}
