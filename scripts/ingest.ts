#!/usr/bin/env tsx
/**
 * OpenSkillTree — YAML Ingest Script
 *
 * Reads all skill tree YAML files under data/ and upserts them into Postgres.
 * Skips trees whose YAML content hash has not changed since the last ingest.
 *
 * Usage:
 *   pnpm ingest                     # ingest all trees
 *   pnpm ingest data/seeds/sports/  # ingest a specific directory
 *   pnpm ingest --force             # ignore content hashes, re-ingest everything
 *
 * Environment:
 *   DATABASE_URL — Postgres connection string (see lib/db.ts)
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { globSync } from "glob";
import yaml from "js-yaml";
import Ajv from "ajv/dist/2020";
import addFormats from "ajv-formats";
import { PoolClient } from "pg";
import { withTransaction } from "../lib/db";

// ---------------------------------------------------------------------------
// Load and compile JSON Schema validator
// ---------------------------------------------------------------------------

const schemaPath = path.resolve(__dirname, "../schema/skill-tree.schema.json");
const rawSchema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validateTree = ajv.compile(rawSchema);

// ---------------------------------------------------------------------------
// Types mirroring the YAML structure
// ---------------------------------------------------------------------------

interface YamlResource {
  title: string;
  url: string;
  type?: "video" | "article" | "course" | "book" | "tool" | "exercise";
}

interface YamlBenchmark {
  level: "beginner" | "intermediate" | "advanced" | "expert";
  criteria: string;
  metrics?: string[];
  resources?: YamlResource[];
  practice?: string[];
  projects?: string[];
  tips?: string[];
}

interface YamlNode {
  id: string;
  title: string;
  description: string;
  benchmarks: YamlBenchmark[];
  icon?: string;
  tags?: string[];
}

interface YamlRelationship {
  source: string;
  target: string;
  type: string;
  note?: string;
}

interface YamlFile {
  tree: {
    id: string;
    title: string;
    description: string;
    domain: string;
    visibility?: string;
  };
  nodes: YamlNode[];
  relationships?: YamlRelationship[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sha256(content: string): string {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex");
}

function findYamlFiles(dirs: string[]): string[] {
  const patterns = dirs.map((d) =>
    d.endsWith(".yaml") || d.endsWith(".yml")
      ? d
      : path.join(d, "**/*.{yaml,yml}")
  );
  return patterns.flatMap((p) => globSync(p)).sort();
}

// ---------------------------------------------------------------------------
// Ingest a single YAML file within a transaction
// ---------------------------------------------------------------------------

async function ingestFile(
  client: PoolClient,
  filePath: string,
  force: boolean
): Promise<{ skipped: boolean; error?: string }> {
  const raw = fs.readFileSync(filePath, "utf-8");
  const contentHash = sha256(raw);
  const relPath = path.relative(process.cwd(), filePath);

  // Validate schema
  const parsed = yaml.load(raw) as YamlFile;
  const valid = validateTree(parsed);
  if (!valid) {
    const messages = validateTree.errors
      ?.map((e) => `  ${e.instancePath} ${e.message}`)
      .join("\n");
    return { skipped: false, error: `Schema validation failed:\n${messages}` };
  }

  // Check if content has changed
  if (!force) {
    const existing = await client.query<{ content_hash: string }>(
      "SELECT content_hash FROM skill_trees WHERE path_id = $1",
      [parsed.tree.id]
    );
    if (
      existing.rows.length > 0 &&
      existing.rows[0].content_hash === contentHash
    ) {
      return { skipped: true };
    }
  }

  // Validate DAG (no cycles via DFS)
  const cycleError = detectCycle(parsed.nodes, parsed.relationships ?? []);
  if (cycleError) {
    return { skipped: false, error: cycleError };
  }

  // Upsert skill_tree
  const { rows: treeRows } = await client.query<{ id: string }>(
    `INSERT INTO skill_trees (path_id, title, description, domain, visibility, source_file, content_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (path_id) DO UPDATE SET
       title        = EXCLUDED.title,
       description  = EXCLUDED.description,
       domain       = EXCLUDED.domain,
       visibility   = EXCLUDED.visibility,
       source_file  = EXCLUDED.source_file,
       content_hash = EXCLUDED.content_hash,
       updated_at   = NOW()
     RETURNING id`,
    [
      parsed.tree.id,
      parsed.tree.title,
      parsed.tree.description,
      parsed.tree.domain,
      parsed.tree.visibility ?? "public",
      relPath,
      contentHash,
    ]
  );
  const treeId = treeRows[0].id;

  // Delete existing nodes + edges for this tree (cascades to edges)
  await client.query("DELETE FROM skill_nodes WHERE tree_id = $1", [treeId]);

  // Build path_id → uuid map for edges
  const nodeIdMap = new Map<string, string>();

  // Insert nodes
  for (const node of parsed.nodes) {
    const { rows } = await client.query<{ id: string }>(
      `INSERT INTO skill_nodes (tree_id, path_id, title, description, benchmarks, icon)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        treeId,
        node.id,
        node.title,
        node.description,
        JSON.stringify(node.benchmarks),
        node.icon ?? null,
      ]
    );
    nodeIdMap.set(node.id, rows[0].id);
  }

  // Insert edges
  for (const rel of parsed.relationships ?? []) {
    const sourceId = nodeIdMap.get(rel.source);
    const targetId = nodeIdMap.get(rel.target);
    if (!sourceId || !targetId) {
      console.warn(
        `  Warning: relationship references unknown node (${rel.source} → ${rel.target})`
      );
      continue;
    }
    await client.query(
      `INSERT INTO skill_edges (tree_id, source_node_id, target_node_id, relationship_type)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT DO NOTHING`,
      [treeId, sourceId, targetId, rel.type]
    );
  }

  // Refresh materialized view
  await client.query(
    "REFRESH MATERIALIZED VIEW CONCURRENTLY skill_tree_summaries"
  );

  return { skipped: false };
}

// ---------------------------------------------------------------------------
// DAG cycle detection (iterative DFS)
// ---------------------------------------------------------------------------

function detectCycle(
  nodes: YamlNode[],
  relationships: YamlRelationship[]
): string | null {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const adj = new Map<string, string[]>();
  for (const id of nodeIds) adj.set(id, []);
  for (const rel of relationships) {
    if (!nodeIds.has(rel.source) || !nodeIds.has(rel.target)) continue;
    adj.get(rel.source)!.push(rel.target);
  }

  const WHITE = 0,
    GRAY = 1,
    BLACK = 2;
  const color = new Map<string, number>();
  for (const id of nodeIds) color.set(id, WHITE);

  function dfs(node: string): boolean {
    color.set(node, GRAY);
    for (const neighbor of adj.get(node) ?? []) {
      if (color.get(neighbor) === GRAY) return true; // cycle found
      if (color.get(neighbor) === WHITE && dfs(neighbor)) return true;
    }
    color.set(node, BLACK);
    return false;
  }

  for (const id of nodeIds) {
    if (color.get(id) === WHITE && dfs(id)) {
      return `Cycle detected in skill graph starting from node "${id}"`;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const dirs = args.filter((a) => !a.startsWith("--"));

  const searchDirs =
    dirs.length > 0
      ? dirs
      : [path.resolve(__dirname, "../data/seeds"), path.resolve(__dirname, "../data/skills")];

  const files = findYamlFiles(searchDirs.filter(fs.existsSync));
  if (files.length === 0) {
    console.log("No YAML files found.");
    process.exit(0);
  }

  console.log(`Found ${files.length} YAML file(s). Ingesting...`);

  let ingested = 0,
    skipped = 0,
    failed = 0;

  for (const file of files) {
    const rel = path.relative(process.cwd(), file);
    try {
      const result = await withTransaction((client) =>
        ingestFile(client, file, force)
      );
      if (result.skipped) {
        console.log(`  skip  ${rel} (unchanged)`);
        skipped++;
      } else if (result.error) {
        console.error(`  FAIL  ${rel}\n${result.error}`);
        failed++;
      } else {
        console.log(`  ok    ${rel}`);
        ingested++;
      }
    } catch (err) {
      console.error(`  FAIL  ${rel}`, err);
      failed++;
    }
  }

  console.log(
    `\nDone. ${ingested} ingested, ${skipped} skipped, ${failed} failed.`
  );
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
