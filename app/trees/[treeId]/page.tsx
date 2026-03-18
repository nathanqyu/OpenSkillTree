import { notFound } from "next/navigation";
import Link from "next/link";
import { query } from "@/lib/db";
import type { SkillTree, SkillNode, SkillEdge } from "@/types/skill-tree";
import { SkillTreeGraph } from "@/components/skill-tree/SkillTreeGraph";

export const revalidate = 86400; // ISR: revalidate daily

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

      {/* React Flow + ELK.js interactive graph */}
      <SkillTreeGraph nodes={nodes} edges={edges} />

      {/* Node list — temporary until graph is interactive */}
      <div className="mt-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Skills ({nodes.length})
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {nodes.map((node) => (
            <NodeSummaryCard key={node.id} node={node} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NodeSummaryCard({ node }: { node: SkillNode }) {
  const levels = node.benchmarks.map((b) => b.level);
  const incomplete = levels.length === 0;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {node.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
        {node.description}
      </p>
      {incomplete ? (
        <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
          Benchmarks needed
        </p>
      ) : (
        <div className="mt-2 flex gap-1">
          {levels.map((level) => (
            <span
              key={level}
              className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs capitalize text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {level}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
