import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { SkillTree, SkillNode, SkillEdge, SkillTreeWithGraph } from "@/types/skill-tree";

/**
 * GET /api/trees/:treeId
 *
 * Returns the full tree with all nodes and edges.
 * :treeId may be a UUID or a path ID (e.g. "sports/pickleball").
 *
 * Used by the tree visualization page.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ treeId: string }> }
) {
  const { treeId } = await params;

  // Accept both UUID and path ID
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      treeId
    );
  const treeCondition = isUuid ? "id = $1" : "path_id = $1";

  const treeRows = await query<SkillTree>(
    `SELECT
       id,
       path_id     AS "pathId",
       title,
       description,
       domain,
       visibility,
       created_at  AS "createdAt",
       updated_at  AS "updatedAt"
     FROM skill_trees
     WHERE ${treeCondition} AND visibility = 'public'`,
    [decodeURIComponent(treeId)]
  );

  if (treeRows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const tree = treeRows[0];

  const [nodes, edges] = await Promise.all([
    query<SkillNode>(
      `SELECT
         id,
         tree_id     AS "treeId",
         path_id     AS "pathId",
         title,
         description,
         benchmarks,
         icon,
         created_at  AS "createdAt",
         updated_at  AS "updatedAt"
       FROM skill_nodes
       WHERE tree_id = $1
       ORDER BY created_at`,
      [tree.id]
    ),
    query<SkillEdge>(
      `SELECT
         id,
         tree_id           AS "treeId",
         source_node_id    AS "sourceNodeId",
         target_node_id    AS "targetNodeId",
         relationship_type AS "relationshipType"
       FROM skill_edges
       WHERE tree_id = $1`,
      [tree.id]
    ),
  ]);

  const response: SkillTreeWithGraph = { ...tree, nodes, edges };

  return NextResponse.json(response, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
