import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { SkillTree, SkillNode, SkillEdge, SkillTreeWithGraph } from "@/types/skill-tree";

/**
 * GET /api/trees/:treeId/export
 *
 * Download the full tree as a JSON file conforming to the OpenSkillTree schema.
 * Sets Content-Disposition to trigger a browser download.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ treeId: string }> }
) {
  const { treeId } = await params;

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      treeId
    );
  const treeCondition = isUuid ? "id = $1" : "path_id = $1";

  const treeRows = await query<SkillTree>(
    `SELECT id, path_id AS "pathId", title, description, domain, visibility,
            created_at AS "createdAt", updated_at AS "updatedAt"
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
      `SELECT id, tree_id AS "treeId", path_id AS "pathId", title, description,
              benchmarks, icon, created_at AS "createdAt", updated_at AS "updatedAt"
       FROM skill_nodes WHERE tree_id = $1 ORDER BY created_at`,
      [tree.id]
    ),
    query<SkillEdge>(
      `SELECT id, tree_id AS "treeId", source_node_id AS "sourceNodeId",
              target_node_id AS "targetNodeId", relationship_type AS "relationshipType"
       FROM skill_edges WHERE tree_id = $1`,
      [tree.id]
    ),
  ]);

  const payload: SkillTreeWithGraph = { ...tree, nodes, edges };
  const filename = `${tree.pathId.replace(/\//g, "-")}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, s-maxage=86400",
    },
  });
}
