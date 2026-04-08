import Link from "next/link";
import type { TreeListItem } from "@/types/skill-tree";
import { DOMAIN_BADGE, DOMAIN_BADGE_FALLBACK } from "@/lib/design-tokens";

export default function TreeCard({ tree }: { tree: TreeListItem }) {
  const domainColor = DOMAIN_BADGE[tree.domain] ?? DOMAIN_BADGE_FALLBACK;

  const incomplete = !tree.hasBenchmarks;

  return (
    <Link
      href={`/trees/${encodeURIComponent(tree.pathId)}`}
      className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${domainColor}`}
        >
          {tree.domain}
        </span>
        {incomplete && (
          <span
            title="Benchmark criteria incomplete — contributions welcome"
            className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
          >
            Incomplete benchmarks
          </span>
        )}
      </div>

      <h2 className="text-base font-semibold text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-300">
        {tree.title}
      </h2>
      <p className="mt-1 line-clamp-2 flex-1 text-sm text-zinc-500 dark:text-zinc-400">
        {tree.description}
      </p>

      <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-600">
        {tree.nodeCount} node{tree.nodeCount !== 1 ? "s" : ""}
      </p>
    </Link>
  );
}
