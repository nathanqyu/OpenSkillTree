/**
 * Unit tests for GET /api/trees/:treeId
 * Mocks the database to test handler logic in isolation.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/db", () => ({
  query: vi.fn(),
}));

import { GET } from "@/app/api/trees/[treeId]/route";
import { query } from "@/lib/db";

const mockQuery = vi.mocked(query);

const TREE_ID = "aaaaaaaa-0000-0000-0000-000000000001";

const mockTree = {
  id: TREE_ID,
  pathId: "sports/pickleball",
  title: "Pickleball",
  description: "Pickleball skill tree",
  domain: "Sports",
  visibility: "public",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

const mockNodes = [
  {
    id: "bbbbbbbb-0000-0000-0000-000000000001",
    treeId: TREE_ID,
    pathId: "sports/pickleball/serve",
    title: "Serve",
    description: "Basic serve technique",
    benchmarks: [{ level: "beginner", criteria: "Can serve consistently" }],
    icon: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

const mockEdges = [
  {
    id: "cccccccc-0000-0000-0000-000000000001",
    treeId: TREE_ID,
    sourceNodeId: "bbbbbbbb-0000-0000-0000-000000000001",
    targetNodeId: "bbbbbbbb-0000-0000-0000-000000000002",
    relationshipType: "requires",
  },
];

describe("GET /api/trees/:treeId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 404 when tree not found", async () => {
    mockQuery.mockResolvedValueOnce([]); // tree not found

    const req = new NextRequest("http://localhost:3000/api/trees/nonexistent");
    const res = await GET(req, { params: Promise.resolve({ treeId: "nonexistent" }) });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("Not found");
  });

  it("returns full tree with nodes and edges by UUID", async () => {
    mockQuery
      .mockResolvedValueOnce([mockTree])
      .mockResolvedValueOnce(mockNodes)
      .mockResolvedValueOnce(mockEdges);

    const req = new NextRequest(`http://localhost:3000/api/trees/${TREE_ID}`);
    const res = await GET(req, { params: Promise.resolve({ treeId: TREE_ID }) });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(TREE_ID);
    expect(body.nodes).toHaveLength(1);
    expect(body.edges).toHaveLength(1);
    expect(body.nodes[0].pathId).toBe("sports/pickleball/serve");
  });

  it("accepts path ID and uses path_id condition", async () => {
    mockQuery
      .mockResolvedValueOnce([mockTree])
      .mockResolvedValueOnce(mockNodes)
      .mockResolvedValueOnce(mockEdges);

    const req = new NextRequest("http://localhost:3000/api/trees/sports%2Fpickleball");
    const res = await GET(req, {
      params: Promise.resolve({ treeId: "sports%2Fpickleball" }),
    });

    expect(res.status).toBe(200);
    // path_id condition should be used (not id =)
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toContain("path_id = $1");
    expect(params).toContain("sports/pickleball"); // decoded
  });

  it("uses id condition for UUID treeId", async () => {
    mockQuery
      .mockResolvedValueOnce([mockTree])
      .mockResolvedValueOnce(mockNodes)
      .mockResolvedValueOnce(mockEdges);

    const req = new NextRequest(`http://localhost:3000/api/trees/${TREE_ID}`);
    await GET(req, { params: Promise.resolve({ treeId: TREE_ID }) });

    const [sql] = mockQuery.mock.calls[0];
    expect(sql).toContain("id = $1");
  });

  it("sets cache-control header", async () => {
    mockQuery
      .mockResolvedValueOnce([mockTree])
      .mockResolvedValueOnce(mockNodes)
      .mockResolvedValueOnce(mockEdges);

    const req = new NextRequest(`http://localhost:3000/api/trees/${TREE_ID}`);
    const res = await GET(req, { params: Promise.resolve({ treeId: TREE_ID }) });

    expect(res.headers.get("Cache-Control")).toContain("s-maxage");
  });
});
