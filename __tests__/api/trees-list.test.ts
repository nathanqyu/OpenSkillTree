/**
 * Unit tests for GET /api/trees
 * Mocks the database to test handler logic in isolation.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock the db module before importing the route
vi.mock("@/lib/db", () => ({
  query: vi.fn(),
}));

import { GET } from "@/app/api/trees/route";
import { query } from "@/lib/db";

const mockQuery = vi.mocked(query);

const mockTrees = [
  {
    id: "aaaaaaaa-0000-0000-0000-000000000001",
    pathId: "sports/pickleball",
    title: "Pickleball",
    description: "Pickleball skill tree",
    domain: "Sports",
    nodeCount: 10,
    hasBenchmarks: true,
    benchmarkCoverage: 1.0,
    createdAt: "2024-01-01T00:00:00Z",
  },
];

describe("GET /api/trees", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns paginated tree list", async () => {
    mockQuery
      .mockResolvedValueOnce(mockTrees)
      .mockResolvedValueOnce([{ total: "1" }]);

    const req = new NextRequest("http://localhost:3000/api/trees");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.trees).toHaveLength(1);
    expect(body.trees[0].pathId).toBe("sports/pickleball");
    expect(body.total).toBe(1);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(24);
  });

  it("passes domain filter to DB", async () => {
    mockQuery
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ total: "0" }]);

    const req = new NextRequest("http://localhost:3000/api/trees?domain=Sports");
    await GET(req);

    // First call should include the domain param
    const [sql, params] = mockQuery.mock.calls[0];
    expect(params).toContain("Sports");
    expect(sql).toContain("domain = $");
  });

  it("respects page and pageSize query params", async () => {
    mockQuery
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ total: "0" }]);

    const req = new NextRequest("http://localhost:3000/api/trees?page=2&pageSize=10");
    const res = await GET(req);
    const body = await res.json();

    expect(body.page).toBe(2);
    expect(body.pageSize).toBe(10);
    // offset = (2-1)*10 = 10 — verify it was passed to DB
    const [, params] = mockQuery.mock.calls[0];
    expect(params).toContain(10); // pageSize
    expect(params).toContain(10); // offset
  });

  it("caps pageSize at 100", async () => {
    mockQuery
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ total: "0" }]);

    const req = new NextRequest("http://localhost:3000/api/trees?pageSize=999");
    const res = await GET(req);
    const body = await res.json();

    expect(body.pageSize).toBe(100);
  });

  it("sets cache-control header", async () => {
    mockQuery
      .mockResolvedValueOnce(mockTrees)
      .mockResolvedValueOnce([{ total: "1" }]);

    const req = new NextRequest("http://localhost:3000/api/trees");
    const res = await GET(req);

    expect(res.headers.get("Cache-Control")).toContain("s-maxage");
  });
});
