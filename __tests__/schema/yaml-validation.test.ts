/**
 * Schema validation tests — verifies all seed YAML files pass AJV validation
 * and have no cycles in the skill graph.
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import Ajv from "ajv/dist/2020";
import addFormats from "ajv-formats";

const schemaPath = path.resolve(__dirname, "../../schema/skill-tree.schema.json");
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
  tree: { id: string; title: string; domain: string; description: string };
  nodes: YamlNode[];
  relationships?: YamlRelationship[];
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
    if (color.get(id) === WHITE && dfs(id)) return `Cycle detected starting from "${id}"`;
  }
  return null;
}

const seedFiles = [
  "data/seeds/sports/pickleball.yaml",
  "data/seeds/sports/tennis.yaml",
  "data/seeds/technology/python.yaml",
  "data/seeds/business/linkedin-content-creation.yaml",
  "data/seeds/business/product-management.yaml",
  "data/seeds/creative-arts/photography.yaml",
];

describe("Seed YAML schema validation", () => {
  it.each(seedFiles)("%s passes AJV schema", (relPath) => {
    const fullPath = path.resolve(__dirname, "../../", relPath);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const parsed = yaml.load(raw) as YamlFile;

    const valid = validateTree(parsed);
    const messages = valid
      ? ""
      : validateTree.errors?.map((e) => `${e.instancePath} ${e.message}`).join("; ");
    expect(valid, `Schema errors: ${messages}`).toBe(true);
  });

  it.each(seedFiles)("%s has no cycles", (relPath) => {
    const fullPath = path.resolve(__dirname, "../../", relPath);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const parsed = yaml.load(raw) as YamlFile;

    const cycleError = detectCycle(parsed.nodes, parsed.relationships ?? []);
    expect(cycleError).toBeNull();
  });

  it.each(seedFiles)("%s has valid path IDs", (relPath) => {
    const fullPath = path.resolve(__dirname, "../../", relPath);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const parsed = yaml.load(raw) as YamlFile;

    expect(parsed.tree.id).toBeTruthy();
    expect(parsed.nodes.length).toBeGreaterThan(0);
    for (const node of parsed.nodes) {
      expect(node.id).toMatch(/^[a-z0-9][a-z0-9-]*(\/[a-z0-9-]+)+$/);
    }
  });
});
