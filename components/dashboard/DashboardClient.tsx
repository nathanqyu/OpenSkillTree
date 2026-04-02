"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllProgress, type StoredTreeProgress } from "@/lib/progress-store";
import { DOMAIN_BADGE, DOMAIN_BADGE_FALLBACK } from "@/lib/design-tokens";

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

// ---------------------------------------------------------------------------
// Progress card
// ---------------------------------------------------------------------------

function ProgressCard({ data }: { data: StoredTreeProgress }) {
  const assessed = Object.values(data.levels).filter((l) => l !== null).length;
  const total = data.nodeCount;
  const pct = total > 0 ? Math.round((assessed / total) * 100) : 0;
  const domainCls = DOMAIN_BADGE[data.domain] ?? DOMAIN_BADGE_FALLBACK;

  return (
    <Link
      href={`/trees/${encodeURIComponent(data.pathId)}`}
      className="group block rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-200">
          {data.title}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${domainCls}`}
        >
          {data.domain}
        </span>
      </div>

      {/* Bar */}
      <div className="mb-2">
        <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-2 rounded-full bg-emerald-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span>
          {assessed}/{total} skills &middot; {pct}%
        </span>
        <span>{timeAgo(data.lastActivity)}</span>
      </div>

      <p className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-emerald-400">
        Continue learning <span>&rarr;</span>
      </p>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export default function DashboardClient() {
  const [progress, setProgress] = useState<StoredTreeProgress[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const all = getAllProgress()
      .filter(
        (p) => Object.values(p.levels).some((l) => l !== null), // has activity
      )
      .sort(
        (a, b) =>
          new Date(b.lastActivity).getTime() -
          new Date(a.lastActivity).getTime(),
      );
    setProgress(all);
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  const totalAssessed = progress.reduce(
    (s, p) => s + Object.values(p.levels).filter((l) => l !== null).length,
    0,
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Your Learning Journey
        </h1>
        {progress.length > 0 ? (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {progress.length} skill tree{progress.length !== 1 ? "s" : ""}{" "}
            started &middot; {totalAssessed} skill
            {totalAssessed !== 1 ? "s" : ""} assessed
          </p>
        ) : (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Track your progress across skill trees
          </p>
        )}
      </div>

      {progress.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium text-zinc-400 dark:text-zinc-500">
            No skill trees started yet
          </p>
          <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
            Pick a skill to learn and begin your journey.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Browse skill trees
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {progress.map((p) => (
              <ProgressCard key={p.treeId} data={p} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Discover more skill trees &rarr;
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
