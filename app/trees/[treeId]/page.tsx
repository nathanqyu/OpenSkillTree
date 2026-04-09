import { notFound } from "next/navigation";
import Link from "next/link";
import { query } from "@/lib/db";
import type { SkillTree, SkillNode, SkillEdge } from "@/types/skill-tree";
import { SkillTreeClient } from "@/components/skill-tree/SkillTreeClient";
import { TreeAssessmentSummary } from "@/components/skill-tree/TreeAssessmentSummary";
import { TREE_OVERVIEWS } from "@/lib/tree-overviews";

export const revalidate = 60;

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
  const overview = TREE_OVERVIEWS[tree.pathId] ?? null;

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
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Link
            href="/#explore"
            className="mb-2 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            ← All skill maps
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {tree.title}
          </h1>
          {overview && (
            <p className="mt-1 text-base font-medium text-zinc-600 dark:text-zinc-300">
              {overview.hook}
            </p>
          )}
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

      {/* Overview section */}
      {overview && (
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          {/* Beginner vs Expert */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Beginner vs Expert
            </h3>
            <div className="space-y-3">
              <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Beginner
                </p>
                <p className="text-xs leading-relaxed text-emerald-800 dark:text-emerald-300">
                  {overview.beginnerProfile}
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Expert
                </p>
                <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                  {overview.expertProfile}
                </p>
              </div>
            </div>
          </div>

          {/* Notable practitioners */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Notable Practitioners
            </h3>
            <div className="space-y-2.5">
              {overview.examples.map((ex) => (
                <div key={ex.name} className="flex gap-2">
                  <span
                    className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      ex.level === "expert"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    }`}
                  >
                    {ex.level === "expert" ? "Expert" : "Beginner"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {ex.name}
                    </p>
                    <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                      {ex.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What you'll learn */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              What You&apos;ll Learn
            </h3>
            <ul className="space-y-1.5">
              {overview.whatYouWillLearn.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300"
                >
                  <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Time estimate */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Time to Intermediate
            </h3>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {overview.timeToIntermediate}
            </p>
            <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              {nodes.length} nodes · {nodes.reduce((sum, n) => sum + n.benchmarks.length, 0)} benchmark levels · Click any node to see criteria, evidence requirements, and progression pathways
            </p>
          </div>
        </div>
      )}

      {/* Assessment framework summary */}
      <div className="mb-6">
        <TreeAssessmentSummary nodes={nodes} />
      </div>

      {/* Interactive roadmap + node detail panel */}
      <SkillTreeClient
        treeId={tree.id}
        treeMeta={{ pathId: tree.pathId, title: tree.title, domain: tree.domain }}
        nodes={nodes}
        edges={edges}
      />
    </div>
  );
}
