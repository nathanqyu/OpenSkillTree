/**
 * Smoke tests for NodeDetailPanel component.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { SkillNode, SkillEdge } from "@/types/skill-tree";

// NodeDetailPanel uses sessionStorage — jsdom provides it
import { NodeDetailPanel } from "@/components/skill-tree/NodeDetailPanel";

const TREE_ID = "aaaaaaaa-0000-0000-0000-000000000001";
const NODE_ID = "bbbbbbbb-0000-0000-0000-000000000001";

const mockNode: SkillNode = {
  id: NODE_ID,
  treeId: TREE_ID,
  pathId: "sports/pickleball/serve",
  title: "Serve",
  description: "The serve is the shot that starts every pickleball rally.",
  benchmarks: [
    { level: "beginner", criteria: "Can serve diagonally over the net with 60% consistency." },
    { level: "intermediate", criteria: "Targets specific zones on the court.", metrics: ["7/10 serves land in target zone"] },
  ],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

const mockEdges: SkillEdge[] = [];

const defaultProps = {
  nodeId: NODE_ID,
  allNodes: [mockNode],
  allEdges: mockEdges,
  treeId: TREE_ID,
  progressMap: {},
  onProgressChange: vi.fn(),
  onGraphNavigate: vi.fn(),
  onClose: vi.fn(),
};

describe("NodeDetailPanel", () => {
  it("renders node title", () => {
    render(<NodeDetailPanel {...defaultProps} />);
    expect(screen.getByText("Serve")).toBeInTheDocument();
  });

  it("renders node description", () => {
    render(<NodeDetailPanel {...defaultProps} />);
    expect(screen.getByText(/starts every pickleball rally/)).toBeInTheDocument();
  });

  it("renders benchmark levels", () => {
    render(<NodeDetailPanel {...defaultProps} />);
    expect(screen.getByText("beginner")).toBeInTheDocument();
    expect(screen.getByText("intermediate")).toBeInTheDocument();
  });

  it("renders benchmark criteria text", () => {
    render(<NodeDetailPanel {...defaultProps} />);
    expect(screen.getByText(/60% consistency/)).toBeInTheDocument();
  });

  it("renders benchmark metrics when present", () => {
    render(<NodeDetailPanel {...defaultProps} />);
    expect(screen.getByText(/7\/10 serves land in target zone/)).toBeInTheDocument();
  });

  it("renders nothing when nodeId is null", () => {
    const { container } = render(<NodeDetailPanel {...defaultProps} nodeId={null} />);
    // Panel should be hidden / empty when no node selected
    expect(container.firstChild).toBeNull();
  });
});
