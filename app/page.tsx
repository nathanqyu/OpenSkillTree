import { query } from "@/lib/db";
import TreeCard from "@/components/gallery/TreeCard";
import DomainFilterClient from "@/app/_components/DomainFilterClient";
import type { TreeListItem } from "@/types/skill-tree";

/**
 * Gallery page — Browse all public skill trees.
 * Server component: fetches directly from DB (no API round-trip needed on server).
 */
export const revalidate = 3600; // ISR: revalidate every hour

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const { domain } = await searchParams;

  const params: unknown[] = [];
  const conditions: string[] = [];
  if (domain && domain !== "All") {
    params.push(domain);
    conditions.push(`domain = $${params.length}`);
  }
  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const [trees, domainCounts] = await Promise.all([
    query<TreeListItem>(
      `SELECT id, path_id AS "pathId", title, description, domain,
              node_count AS "nodeCount", has_benchmarks AS "hasBenchmarks",
              benchmark_coverage AS "benchmarkCoverage", created_at AS "createdAt"
       FROM skill_tree_summaries
       ${where}
       ORDER BY created_at DESC`,
      params
    ).catch(() => [] as TreeListItem[]),
    query<{ domain: string; count: string }>(
      "SELECT domain, COUNT(*) AS count FROM skill_tree_summaries GROUP BY domain"
    ).catch(() => [] as { domain: string; count: string }[]),
  ]);

  const counts: Record<string, number> = {};
  for (const row of domainCounts) {
    counts[row.domain] = parseInt(row.count, 10);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Skill Trees
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          The open standard for measuring human skills — explore what mastery
          looks like in any domain.
        </p>
      </div>

      <DomainFilterClient selected={domain ?? "All"} counts={counts} />

      {trees.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">
            {domain && domain !== "All"
              ? `No skill trees in ${domain} yet.`
              : "No skill trees yet. Run pnpm ingest to populate the database."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trees.map((tree) => (
            <TreeCard key={tree.id} tree={tree} />
          ))}
        </div>
      )}
    </div>
  );
}
