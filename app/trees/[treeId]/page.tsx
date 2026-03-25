import { notFound } from "next/navigation";
import Link from "next/link";
import { query } from "@/lib/db";
import type { SkillTree, SkillNode, SkillEdge } from "@/types/skill-tree";
import { SkillTreeClient } from "@/components/skill-tree/SkillTreeClient";

export const revalidate = 60; // ISR: revalidate every minute to pick up data changes quickly

interface PageParams {
  params: Promise<{ treeId: string }>;
}

export async function generateMetadata({ params }: PageParams) {
  const { treeId } = await params;
  const trees = await query<Pick<SkillTree, "title" | "description">>(
    `SELECT title, description FROM skill_trees WHERE path_id = $1 AND visibility = 'public'`,
    [decodeURIComponent(treeId)]
  ).catch(() => []);

  if (!trees[0]) return {};
  return {
    title: `${trees[0].title} — OpenSkillTree`,
    description: trees[0].description,
  };
}

export default async function TreePage({ params }: PageParams) {
  const { treeId } = await params;
  const decodedId = decodeURIComponent(treeId);

  const treeRows = await query<SkillTree>(
    `SELECT id, path_id AS "pathId", title, description, domain, visibility,
            created_at AS "createdAt", updated_at AS "updatedAt"
     FROM skill_trees
     WHERE path_id = $1 AND visibility = 'public'`,
    [decodedId]
  ).catch(() => []);

  if (!treeRows[0]) notFound();
  const tree = treeRows[0];

  const [nodes, edges] = await Promise.all([
    query<SkillNode>(
      `SELECT id, tree_id AS "treeId", path_id AS "pathId", title, description,
              benchmarks, icon, created_at AS "createdAt", updated_at AS "updatedAt"
       FROM skill_nodes WHERE tree_id = $1 ORDER BY created_at`,
      [tree.id]
    ).catch(() => []),
    query<SkillEdge>(
      `SELECT id, tree_id AS "treeId", source_node_id AS "sourceNodeId",
              target_node_id AS "targetNodeId", relationship_type AS "relationshipType"
       FROM skill_edges WHERE tree_id = $1`,
      [tree.id]
    ).catch(() => []),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Link
            href="/"
            className="mb-2 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            ← All trees
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {tree.title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
            {tree.description}
          </p>
        </div>
        <a
          href={`/api/trees/${encodeURIComponent(tree.pathId)}/export`}
          className="shrink-0 rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-300"
        >
          Export JSON
        </a>
      </div>

      {/* Interactive graph + node detail panel */}
      <SkillTreeClient treeId={tree.id} nodes={nodes} edges={edges} />
    </div>
  );
}

