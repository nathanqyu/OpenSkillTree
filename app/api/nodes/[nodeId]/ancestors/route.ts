import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { SkillNode } from "@/types/skill-tree";

interface AncestorRow extends SkillNode {
  depth: number;
}

/**
 * GET /api/nodes/:nodeId/ancestors
 *
 * Returns all prerequisite nodes for the given node via a recursive CTE.
 * Nodes are ordered by depth (deepest prerequisite first).
 *
 * Only traverses edges with relationship_type = 'requires'.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ nodeId: string }> }
) {
  const { nodeId } = await params;

  const rows = await query<AncestorRow>(
    `WITH RECURSIVE ancestors AS (
       SELECT source_node_id AS node_id, 1 AS depth
       FROM skill_edges
       WHERE target_node_id = $1
         AND relationship_type = 'requires'
       UNION ALL
       SELECT e.source_node_id, a.depth + 1
       FROM skill_edges e
       JOIN ancestors a ON e.target_node_id = a.node_id
       WHERE e.relationship_type = 'requires'
         AND a.depth < 50
     )
     SELECT
       n.id,
       n.tree_id     AS "treeId",
       n.path_id     AS "pathId",
       n.title,
       n.description,
       n.benchmarks,
       n.icon,
       n.created_at  AS "createdAt",
       n.updated_at  AS "updatedAt",
       a.depth
     FROM skill_nodes n
     JOIN ancestors a ON n.id = a.node_id
     ORDER BY a.depth DESC`,
    [nodeId]
  );

  if (rows.length === 0) {
    // Verify the node actually exists before returning an empty array
    const exists = await query<{ id: string }>(
      "SELECT id FROM skill_nodes WHERE id = $1",
      [nodeId]
    );
    if (exists.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  return NextResponse.json(
    { nodeId, ancestors: rows },
    {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    }
  );
}
