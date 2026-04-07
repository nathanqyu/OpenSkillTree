/**
 * Smoke tests for SkillTreeGraph component.
 * Mocks reactflow and elkjs since they require browser canvas APIs.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { SkillNode, SkillEdge } from "@/types/skill-tree";

// Mock reactflow before importing the component
vi.mock("reactflow", async () => {
  const React = await import("react");
  return {
    __esModule: true,
    default: ({ children }: { children?: React.ReactNode }) =>
      React.createElement("div", { "data-testid": "react-flow" }, children),
    ReactFlowProvider: ({ children }: { children?: React.ReactNode }) =>
      React.createElement("div", { "data-testid": "react-flow-provider" }, children),
    Background: () => null,
    Controls: () => null,
    MiniMap: () => null,
    useNodesState: () => [[], vi.fn(), vi.fn()],
    useEdgesState: () => [[], vi.fn(), vi.fn()],
    useReactFlow: () => ({ setCenter: vi.fn() }),
    Handle: () => null,
    Position: { Top: "top", Bottom: "bottom", Left: "left", Right: "right" },
    MarkerType: { ArrowClosed: "arrowclosed" },
  };
});

// Mock elkjs
vi.mock("elkjs/lib/elk.bundled.js", () => ({
  default: class MockELK {
    layout(graph: { children: unknown[]; edges: unknown[] }) {
      return Promise.resolve({
        children: (graph.children as Array<{ id: string }>).map((n) => ({
          ...n,
          x: 0,
          y: 0,
          width: 200,
          height: 76,
        })),
        edges: graph.edges,
      });
    }
  },
}));

import { SkillTreeGraph } from "@/components/skill-tree/SkillTreeGraph";

const TREE_ID = "aaaaaaaa-0000-0000-0000-000000000001";

const mockNodes: SkillNode[] = [
  {
    id: "n1",
    treeId: TREE_ID,
    pathId: "sports/pickleball/serve",
    title: "Serve",
    description: "The serve",
    benchmarks: [{ level: "beginner", criteria: "Can serve" }],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "n2",
    treeId: TREE_ID,
    pathId: "sports/pickleball/dink",
    title: "Dink",
    description: "Soft shot",
    benchmarks: [{ level: "intermediate", criteria: "Can dink consistently" }],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

const mockEdges: SkillEdge[] = [
  {
    id: "e1",
    treeId: TREE_ID,
    sourceNodeId: "n1",
    targetNodeId: "n2",
    relationshipType: "requires",
  },
];

const defaultProps = {
  nodes: mockNodes,
  edges: mockEdges,
  selectedNodeId: null,
  progressMap: {},
  onNodeClick: vi.fn(),
};

describe("SkillTreeGraph", () => {
  it("renders without crashing", () => {
    const { container } = render(<SkillTreeGraph {...defaultProps} />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders the ReactFlowProvider wrapper", () => {
    render(<SkillTreeGraph {...defaultProps} />);
    expect(screen.getByTestId("react-flow-provider")).toBeInTheDocument();
  });

  it("renders with empty nodes and edges", () => {
    const { container } = render(
      <SkillTreeGraph {...defaultProps} nodes={[]} edges={[]} />
    );
    expect(container.firstChild).not.toBeNull();
  });

  it("renders with a selectedNodeId", () => {
    const { container } = render(
      <SkillTreeGraph {...defaultProps} selectedNodeId="n1" />
    );
    expect(container.firstChild).not.toBeNull();
  });
});
