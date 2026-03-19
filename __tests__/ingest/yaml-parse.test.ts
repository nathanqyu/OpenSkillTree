/**
 * Ingest pipeline tests — validates YAML files parse correctly
 * and produce the expected structure for DB ingestion.
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

interface YamlBenchmark {
  level: "beginner" | "intermediate" | "advanced" | "expert";
  criteria: string;
  metrics?: string[];
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

const SEED_DIR = path.resolve(__dirname, "../../data/seeds");
const VALID_DOMAINS = ["Sports", "Technology", "Creative Arts", "Business", "Science"] as const;
const VALID_LEVELS = ["beginner", "intermediate", "advanced", "expert"] as const;
const VALID_REL_TYPES = ["requires", "enables", "component-of", "complementary", "variant-of"] as const;

function loadYaml(relPath: string): YamlFile {
  const fullPath = path.join(SEED_DIR, relPath);
  return yaml.load(fs.readFileSync(fullPath, "utf-8")) as YamlFile;
}

const seedFiles: [string, string][] = [
  ["sports/pickleball.yaml", "sports/pickleball"],
  ["sports/tennis.yaml", "sports/tennis"],
  ["technology/python.yaml", "technology/python"],
  ["business/linkedin-content-creation.yaml", "business/linkedin-content-creation"],
  ["business/product-management.yaml", "business/product-management"],
  ["creative-arts/photography.yaml", "creative-arts/photography"],
];

describe("YAML ingest: parse correctness", () => {
  it.each(seedFiles)("%s parses without error", (file) => {
    expect(() => loadYaml(file)).not.toThrow();
  });

  it.each(seedFiles)("%s tree metadata is complete", (file, expectedId) => {
    const { tree } = loadYaml(file);
    expect(tree.id).toBe(expectedId);
    expect(tree.title).toBeTruthy();
    expect(tree.description).toBeTruthy();
    expect(VALID_DOMAINS).toContain(tree.domain);
  });

  it.each(seedFiles)("%s nodes have required fields", (file) => {
    const { nodes } = loadYaml(file);
    expect(nodes.length).toBeGreaterThan(0);
    for (const node of nodes) {
      expect(node.id, `node ${node.id} missing id`).toBeTruthy();
      expect(node.title, `node ${node.id} missing title`).toBeTruthy();
      expect(node.description, `node ${node.id} missing description`).toBeTruthy();
      expect(
        Array.isArray(node.benchmarks) && node.benchmarks.length > 0,
        `node ${node.id} must have at least one benchmark`
      ).toBe(true);
    }
  });

  it.each(seedFiles)("%s benchmarks have valid levels and criteria", (file) => {
    const { nodes } = loadYaml(file);
    for (const node of nodes) {
      for (const bm of node.benchmarks) {
        expect(VALID_LEVELS, `node ${node.id} has invalid benchmark level "${bm.level}"`).toContain(
          bm.level
        );
        expect(bm.criteria, `node ${node.id} benchmark missing criteria`).toBeTruthy();
      }
    }
  });

  it.each(seedFiles)("%s relationships reference valid node IDs", (file) => {
    const { nodes, relationships = [] } = loadYaml(file);
    const nodeIds = new Set(nodes.map((n) => n.id));
    for (const rel of relationships) {
      expect(
        nodeIds.has(rel.source),
        `relationship source "${rel.source}" not found in nodes`
      ).toBe(true);
      expect(
        nodeIds.has(rel.target),
        `relationship target "${rel.target}" not found in nodes`
      ).toBe(true);
      expect(VALID_REL_TYPES, `invalid relationship type "${rel.type}"`).toContain(rel.type);
    }
  });
});

describe("YAML ingest: DB record shapes", () => {
  it("pickleball.yaml produces expected tree record fields", () => {
    const { tree } = loadYaml("sports/pickleball.yaml");
    // These are the fields ingest.ts maps to DB columns
    expect(tree.id).toBe("sports/pickleball");
    expect(tree.domain).toBe("Sports");
    expect(tree.visibility ?? "public").toBe("public");
  });

  it("pickleball.yaml node IDs are namespaced under the tree", () => {
    const { tree, nodes } = loadYaml("sports/pickleball.yaml");
    for (const node of nodes) {
      expect(node.id.startsWith(tree.id + "/")).toBe(true);
    }
  });

  it("pickleball.yaml has at least one relationship", () => {
    const { relationships = [] } = loadYaml("sports/pickleball.yaml");
    expect(relationships.length).toBeGreaterThan(0);
  });
});
