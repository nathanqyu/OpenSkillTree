import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { TreeListItem, TreeListResponse } from "@/types/skill-tree";

const PAGE_SIZE = 24;

/**
 * GET /api/trees
 *
 * List all public skill trees with gallery metadata.
 * Served from the skill_tree_summaries materialized view for fast response.
 *
 * Query params:
 *   domain   — filter by domain (e.g. "Sports")
 *   page     — 1-based page number (default: 1)
 *   pageSize — items per page (default: 24, max: 100)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const domain = searchParams.get("domain") ?? null;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? String(PAGE_SIZE), 10))
  );
  const offset = (page - 1) * pageSize;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (domain) {
    params.push(domain);
    conditions.push(`domain = $${params.length}`);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const [rows, countRows] = await Promise.all([
    query<TreeListItem>(
      `SELECT
         id,
         path_id          AS "pathId",
         title,
         description,
         domain,
         node_count       AS "nodeCount",
         has_benchmarks   AS "hasBenchmarks",
         benchmark_coverage AS "benchmarkCoverage",
         created_at       AS "createdAt"
       FROM skill_tree_summaries
       ${where}
       ORDER BY created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, pageSize, offset]
    ),
    query<{ total: string }>(
      `SELECT COUNT(*) AS total FROM skill_tree_summaries ${where}`,
      params
    ),
  ]);

  const response: TreeListResponse = {
    trees: rows,
    total: parseInt(countRows[0]?.total ?? "0", 10),
    page,
    pageSize,
  };

  return NextResponse.json(response, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
