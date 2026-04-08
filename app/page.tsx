import { query } from "@/lib/db";
import TreeCard from "@/components/gallery/TreeCard";
import SearchResultCard from "@/components/gallery/SearchResultCard";
import DomainFilterClient from "@/app/_components/DomainFilterClient";
import SearchBar from "@/components/gallery/SearchBar";
import LandingHero from "@/components/landing/LandingHero";
import LandingWhatItDoes from "@/components/landing/LandingWhatItDoes";
import LandingWhyItMatters from "@/components/landing/LandingWhyItMatters";
import LandingWhatItEnables from "@/components/landing/LandingWhatItEnables";
import LandingWhyNow from "@/components/landing/LandingWhyNow";
import LandingOpenSource from "@/components/landing/LandingOpenSource";
import LandingFinalCTA from "@/components/landing/LandingFinalCTA";
import type { TreeListItem, SearchResultItem } from "@/types/skill-tree";

/**
 * Gallery page — Browse all public skill trees.
 * Server component: fetches directly from DB (no API round-trip needed on server).
 * When ?q= is present the page is dynamic (ISR bypassed); otherwise ISR at 1 hour.
 */
export const revalidate = 60; // ISR: revalidate every minute to pick up data changes quickly

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string; q?: string }>;
}) {
  const { domain, q } = await searchParams;
  const searchQuery = q?.trim() ?? "";

  // ---- Search mode --------------------------------------------------------
  if (searchQuery) {
    const rows = await query<SearchResultItem>(
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
       LIMIT 48`,
      [searchQuery]
    ).catch(() => [] as SearchResultItem[]);

    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Skill Maps
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Structured skill graphs with benchmark criteria and progression pathways.
          </p>
        </div>

        <SearchBar defaultValue={searchQuery} />

        <div className="mt-6 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span>
            {rows.length === 0
              ? "No results"
              : `${rows.length} result${rows.length !== 1 ? "s" : ""}`}
            {" for "}
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              &ldquo;{searchQuery}&rdquo;
            </span>
          </span>
        </div>

        {rows.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-zinc-500 dark:text-zinc-400">
              No skill maps or nodes match &ldquo;{searchQuery}&rdquo;. Try a different term.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((result) => (
              <SearchResultCard
                key={result.kind === "node" ? result.nodeId : result.treeId}
                result={result}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---- Gallery mode -------------------------------------------------------
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
      <LandingHero treeCount={trees.length} />
      <LandingWhatItDoes />
      <LandingWhyItMatters />
      <LandingWhatItEnables />
      <LandingWhyNow />

      {/* Explore section */}
      <section
        id="explore"
        className="py-16 border-b border-zinc-100 dark:border-zinc-900"
      >
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          The library
        </p>
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Explore Skill Maps
        </h2>

        <SearchBar />

        <div className="mt-4">
          <DomainFilterClient selected={domain ?? "All"} counts={counts} />
        </div>

        {trees.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-zinc-500 dark:text-zinc-400">
              {domain && domain !== "All"
                ? `No skill maps in ${domain} yet.`
                : "No skill maps yet. Run pnpm ingest to populate the database."}
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trees.map((tree) => (
              <TreeCard key={tree.id} tree={tree} />
            ))}
          </div>
        )}
      </section>

      <LandingOpenSource />
      <LandingFinalCTA />
    </div>
  );
}
