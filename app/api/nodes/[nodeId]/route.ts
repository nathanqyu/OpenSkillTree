import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { SkillNode, CrossTreeLink, NodeDetailResponse } from "@/types/skill-tree";

/**
 * GET /api/nodes/:nodeId
 *
 * Returns full node detail including cross-tree links.
 * :nodeId must be a UUID.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ nodeId: string }> }
) {
  const { nodeId } = await params;

  const nodeRows = await query<SkillNode>(
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
     WHERE id = $1`,
    [nodeId]
  );

  if (nodeRows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const crossTreeLinks = await query<CrossTreeLink>(
    `SELECT
       sce.relationship_type           AS "relationshipType",
       st.id                           AS "targetTreeId",
       st.path_id                      AS "targetTreePathId",
       st.title                        AS "targetTreeTitle",
       st.domain                       AS "targetTreeDomain",
       sn.id                           AS "targetNodeId",
       sn.path_id                      AS "targetNodePathId",
       sn.title                        AS "targetNodeTitle",
       LEFT(sn.description, 200)       AS "targetNodeDescription",
       jsonb_array_length(sn.benchmarks) AS "targetNodeLevelCount"
     FROM skill_cross_edges sce
     JOIN skill_nodes sn ON sn.id = sce.target_node_id
     JOIN skill_trees st ON st.id = sn.tree_id
     WHERE sce.source_node_id = $1`,
    [nodeId]
  );

  const response: NodeDetailResponse = { ...nodeRows[0], crossTreeLinks };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
