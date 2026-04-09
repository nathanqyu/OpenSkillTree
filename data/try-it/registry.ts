/**
 * Try-It Module Registry
 *
 * Central lookup for all try-it modules across domains.
 * Import module arrays from domain-specific files and register them here.
 */

import type { TryItModule } from "@/types/try-it";
import { PYTHON_MODULES } from "./python-modules";
import { SPORTS_MODULES } from "./sports-modules";
import { CREATIVE_MODULES } from "./creative-modules";

const ALL_MODULES: TryItModule[] = [
  ...PYTHON_MODULES,
  ...SPORTS_MODULES,
  ...CREATIVE_MODULES,
];

/** Find a module by its unique ID. */
export function getModuleById(id: string): TryItModule | null {
  return ALL_MODULES.find((m) => m.id === id) ?? null;
}

/** Get all modules targeting a specific skill node. */
export function getModulesForNode(nodePathId: string): TryItModule[] {
  return ALL_MODULES.filter((m) => m.nodePathId === nodePathId);
}

/** Get all modules for a given tree. */
export function getModulesForTree(treePathId: string): TryItModule[] {
  return ALL_MODULES.filter((m) => m.treePathId === treePathId);
}

/** Get all available modules. */
export function getAllModules(): TryItModule[] {
  return ALL_MODULES;
}
