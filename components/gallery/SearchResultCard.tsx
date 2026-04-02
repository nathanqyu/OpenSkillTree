import Link from "next/link";
import type { SearchResultItem } from "@/types/skill-tree";
import { DOMAIN_BADGE, DOMAIN_BADGE_FALLBACK } from "@/lib/design-tokens";

export default function SearchResultCard({ result }: { result: SearchResultItem }) {
  const domainColor = DOMAIN_BADGE[result.treeDomain] ?? DOMAIN_BADGE_FALLBACK;

  const isNode = result.kind === "node";

  // Node results deep-link into the tree with the node pre-selected
  const href = isNode
    ? `/trees/${encodeURIComponent(result.treePathId)}?node=${result.nodeId}`
    : `/trees/${encodeURIComponent(result.treePathId)}`;

  const title = isNode ? result.nodeTitle! : result.treeTitle;
  const description = isNode ? result.nodeDescription! : result.treeDescription;

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${domainColor}`}
        >
          {result.treeDomain}
        </span>
        {isNode && (
          <span className="inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            Node
          </span>
        )}
      </div>

      <h2 className="text-base font-semibold text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-300">
        {title}
      </h2>

      {isNode && (
        <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
          in {result.treeTitle}
        </p>
      )}

      <p className="mt-1 line-clamp-2 flex-1 text-sm text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
    </Link>
  );
}
