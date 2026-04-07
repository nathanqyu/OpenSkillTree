/**
 * Unit tests for GET /api/trees/:treeId/export
 * Mocks the database to test handler logic in isolation.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/db", () => ({
  query: vi.fn(),
}));

import { GET } from "@/app/api/trees/[treeId]/export/route";
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
    description: "Basic serve",
    benchmarks: [],
    icon: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

const mockEdges: object[] = [];

describe("GET /api/trees/:treeId/export", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 404 when tree not found", async () => {
    mockQuery.mockResolvedValueOnce([]);

    const req = new NextRequest("http://localhost:3000/api/trees/missing/export");
    const res = await GET(req, { params: Promise.resolve({ treeId: "missing" }) });

    expect(res.status).toBe(404);
  });

  it("returns JSON with Content-Disposition attachment header", async () => {
    mockQuery
      .mockResolvedValueOnce([mockTree])
      .mockResolvedValueOnce(mockNodes)
      .mockResolvedValueOnce(mockEdges);

    const req = new NextRequest(`http://localhost:3000/api/trees/${TREE_ID}/export`);
    const res = await GET(req, { params: Promise.resolve({ treeId: TREE_ID }) });

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("application/json");
    const disposition = res.headers.get("Content-Disposition") ?? "";
    expect(disposition).toContain("attachment");
    expect(disposition).toContain("sports-pickleball.json");
  });

  it("export payload contains nodes and edges", async () => {
    mockQuery
      .mockResolvedValueOnce([mockTree])
      .mockResolvedValueOnce(mockNodes)
      .mockResolvedValueOnce(mockEdges);

    const req = new NextRequest(`http://localhost:3000/api/trees/${TREE_ID}/export`);
    const res = await GET(req, { params: Promise.resolve({ treeId: TREE_ID }) });

    const body = await res.json();
    expect(body.id).toBe(TREE_ID);
    expect(Array.isArray(body.nodes)).toBe(true);
    expect(Array.isArray(body.edges)).toBe(true);
    expect(body.nodes[0].pathId).toBe("sports/pickleball/serve");
  });

  it("filename uses slashes-to-dashes conversion", async () => {
    mockQuery
      .mockResolvedValueOnce([mockTree])
      .mockResolvedValueOnce(mockNodes)
      .mockResolvedValueOnce(mockEdges);

    const req = new NextRequest(`http://localhost:3000/api/trees/${TREE_ID}/export`);
    const res = await GET(req, { params: Promise.resolve({ treeId: TREE_ID }) });

    const disposition = res.headers.get("Content-Disposition") ?? "";
    // pathId "sports/pickleball" → filename "sports-pickleball.json"
    expect(disposition).not.toContain("/");
    expect(disposition).toContain("sports-pickleball.json");
  });
});
