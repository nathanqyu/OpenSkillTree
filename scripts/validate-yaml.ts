#!/usr/bin/env tsx
/**
 * OpenSkillTree — YAML Dry-Run Validator
 *
 * Validates all YAML seed files against the skill tree schema and checks for
 * cycles in the skill graph. No database connection required.
 *
 * Usage:
 *   tsx scripts/validate-yaml.ts
 *   tsx scripts/validate-yaml.ts data/seeds/sports/
 */

import fs from "fs";
import path from "path";
import { globSync } from "glob";
import yaml from "js-yaml";
import Ajv from "ajv/dist/2020";
import addFormats from "ajv-formats";

const schemaPath = path.resolve(__dirname, "../schema/skill-tree.schema.json");
const rawSchema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validateTree = ajv.compile(rawSchema);

interface YamlNode {
  id: string;
}

interface YamlRelationship {
  source: string;
  target: string;
}

interface YamlFile {
  nodes: YamlNode[];
  relationships?: YamlRelationship[];
}

function findYamlFiles(dirs: string[]): string[] {
  const patterns = dirs.map((d) =>
    d.endsWith(".yaml") || d.endsWith(".yml")
      ? d
      : path.join(d, "**/*.{yaml,yml}")
  );
  return patterns.flatMap((p) => globSync(p)).sort();
}

function detectCycle(nodes: YamlNode[], relationships: YamlRelationship[]): string | null {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const adj = new Map<string, string[]>();
  for (const id of nodeIds) adj.set(id, []);
  for (const rel of relationships) {
    if (!nodeIds.has(rel.source) || !nodeIds.has(rel.target)) continue;
    adj.get(rel.source)!.push(rel.target);
  }

  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map<string, number>();
  for (const id of nodeIds) color.set(id, WHITE);

  function dfs(node: string): boolean {
    color.set(node, GRAY);
    for (const neighbor of adj.get(node) ?? []) {
      if (color.get(neighbor) === GRAY) return true;
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

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const searchDirs =
  args.length > 0
    ? args
    : [
        path.resolve(__dirname, "../data/seeds"),
        path.resolve(__dirname, "../data/skills"),
      ];

const files = findYamlFiles(searchDirs.filter(fs.existsSync));
if (files.length === 0) {
  console.log("No YAML files found.");
  process.exit(0);
}

console.log(`Validating ${files.length} YAML file(s)...`);

let passed = 0;
let failed = 0;

for (const file of files) {
  const rel = path.relative(process.cwd(), file);
  try {
    const raw = fs.readFileSync(file, "utf-8");
    const parsed = yaml.load(raw) as YamlFile;

    const valid = validateTree(parsed);
    if (!valid) {
      const messages = validateTree.errors
        ?.map((e) => `    ${e.instancePath} ${e.message}`)
        .join("\n");
      console.error(`  FAIL  ${rel}\n    Schema validation failed:\n${messages}`);
      failed++;
      continue;
    }

    const cycleError = detectCycle(parsed.nodes, parsed.relationships ?? []);
    if (cycleError) {
      console.error(`  FAIL  ${rel}\n    ${cycleError}`);
      failed++;
      continue;
    }

    console.log(`  ok    ${rel}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL  ${rel}`, err);
    failed++;
  }
}

console.log(`\nDone. ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
