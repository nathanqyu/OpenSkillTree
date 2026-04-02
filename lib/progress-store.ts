"use client";

import type { BenchmarkLevelValue } from "@/types/skill-tree";

// ---------------------------------------------------------------------------
// Stored shape — one key per tree in localStorage
// ---------------------------------------------------------------------------

export interface StoredTreeProgress {
  treeId: string;
  pathId: string;
  title: string;
  domain: string;
  nodeCount: number;
  /** nodeId → highest assessed level (null = not assessed) */
  levels: Record<string, BenchmarkLevelValue | null>;
  startedAt: string;
  lastActivity: string;
}

const KEY_PREFIX = "ost_progress_";
function key(treeId: string) {
  return `${KEY_PREFIX}${treeId}`;
}

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export function loadProgress(treeId: string): StoredTreeProgress | null {
  try {
    const raw = localStorage.getItem(key(treeId));
    return raw ? (JSON.parse(raw) as StoredTreeProgress) : null;
  } catch {
    return null;
  }
}

export function getAllProgress(): StoredTreeProgress[] {
  const out: StoredTreeProgress[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(KEY_PREFIX)) {
        const raw = localStorage.getItem(k);
        if (raw) out.push(JSON.parse(raw) as StoredTreeProgress);
      }
    }
  } catch {
    /* SSR / private */
  }
  return out;
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

export function saveNodeLevel(
  treeId: string,
  treeMeta: { pathId: string; title: string; domain: string },
  nodeId: string,
  level: BenchmarkLevelValue | null,
  nodeCount: number,
): void {
  try {
    const existing = loadProgress(treeId);
    const now = new Date().toISOString();
    const data: StoredTreeProgress = existing ?? {
      treeId,
      pathId: treeMeta.pathId,
      title: treeMeta.title,
      domain: treeMeta.domain,
      nodeCount,
      levels: {},
      startedAt: now,
      lastActivity: now,
    };
    data.levels[nodeId] = level;
    data.lastActivity = now;
    data.nodeCount = nodeCount;
    localStorage.setItem(key(treeId), JSON.stringify(data));
  } catch {
    /* private browsing / quota */
  }
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

export function clearProgress(treeId: string): void {
  try {
    localStorage.removeItem(key(treeId));
  } catch {
    /* noop */
  }
}
