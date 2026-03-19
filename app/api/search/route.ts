import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { SearchResultItem, SearchResponse } from "@/types/skill-tree";

const PAGE_SIZE = 20;

/**
 * GET /api/search
 *
 * Full-text search across skill tree titles/descriptions and node titles/descriptions.
 * Uses the GIN indexes on to_tsvector already defined in schema.sql.
 *
 * Results are ranked: trees first (exact/broad match), then nodes with parent tree context.
 *
 * Query params:
 *   q        — search term (required; empty returns empty results)
 *   page     — 1-based page number (default: 1)
 *   pageSize — items per page (default: 20, max: 100)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q")?.trim() ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? String(PAGE_SIZE), 10))
  );
  const offset = (page - 1) * pageSize;

  if (!q) {
    return NextResponse.json<SearchResponse>({
      results: [],
      total: 0,
      page,
      pageSize,
      query: q,
    });
  }

  // Use plainto_tsquery for simple phrase/word input (no syntax required from user)
  const [rows, countRows] = await Promise.all([
    query<SearchResultItem>(
      `WITH q AS (SELECT plainto_tsquery('english', $1) AS tsq)
       SELECT
         kind,
         score,
         "treeId",
         "treePathId",
         "treeTitle",
         "treeDomain",
         "treeDescription",
         "nodeId",
         "nodePathId",
         "nodeTitle",
         "nodeDescription"
       FROM (
         -- Tree-level results
         SELECT
           'tree'::text                                                             AS kind,
           ts_rank(to_tsvector('english', st.title || ' ' || st.description), q.tsq) AS score,
           st.id                                                                    AS "treeId",
           st.path_id                                                               AS "treePathId",
           st.title                                                                 AS "treeTitle",
           st.domain                                                                AS "treeDomain",
           LEFT(st.description, 200)                                                AS "treeDescription",
           NULL::uuid                                                               AS "nodeId",
           NULL::text                                                               AS "nodePathId",
           NULL::text                                                               AS "nodeTitle",
           NULL::text                                                               AS "nodeDescription"
         FROM skill_trees st, q
         WHERE st.visibility = 'public'
           AND to_tsvector('english', st.title || ' ' || st.description) @@ q.tsq

         UNION ALL

         -- Node-level results (includes parent tree context)
         SELECT
           'node'::text                                                               AS kind,
           ts_rank(to_tsvector('english', sn.title || ' ' || sn.description), q.tsq) AS score,
           st.id                                                                      AS "treeId",
           st.path_id                                                                 AS "treePathId",
           st.title                                                                   AS "treeTitle",
           st.domain                                                                  AS "treeDomain",
           LEFT(st.description, 200)                                                  AS "treeDescription",
           sn.id                                                                      AS "nodeId",
           sn.path_id                                                                 AS "nodePathId",
           sn.title                                                                   AS "nodeTitle",
           LEFT(sn.description, 200)                                                  AS "nodeDescription"
         FROM skill_nodes sn
         JOIN skill_trees st ON st.id = sn.tree_id, q
         WHERE st.visibility = 'public'
           AND to_tsvector('english', sn.title || ' ' || sn.description) @@ q.tsq
       ) combined
       ORDER BY CASE kind WHEN 'tree' THEN 1 ELSE 2 END, score DESC
       LIMIT $2 OFFSET $3`,
      [q, pageSize, offset]
    ),
    query<{ total: string }>(
      `WITH q AS (SELECT plainto_tsquery('english', $1) AS tsq)
       SELECT (
         (SELECT COUNT(*) FROM skill_trees st, q
          WHERE st.visibility = 'public'
            AND to_tsvector('english', st.title || ' ' || st.description) @@ q.tsq)
         +
         (SELECT COUNT(*) FROM skill_nodes sn
          JOIN skill_trees st ON st.id = sn.tree_id, q
          WHERE st.visibility = 'public'
            AND to_tsvector('english', sn.title || ' ' || sn.description) @@ q.tsq)
       )::text AS total`,
      [q]
    ),
  ]);

  return NextResponse.json<SearchResponse>(
    {
      results: rows,
      total: parseInt(countRows[0]?.total ?? "0", 10),
      page,
      pageSize,
      query: q,
    },
    {
      headers: {
        // Short cache — search results should be reasonably fresh
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
