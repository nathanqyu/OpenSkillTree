import type { SkillNode } from "@/types/skill-tree";
import {
  ASSESSMENT_METHOD_LABELS,
  SIGNAL_LABELS,
} from "@/lib/design-tokens";

interface TreeAssessmentSummaryProps {
  nodes: SkillNode[];
}

export function TreeAssessmentSummary({ nodes }: TreeAssessmentSummaryProps) {
  // Aggregate assessment methods across all benchmarks
  const methodSet = new Set<string>();
  let nodesWithEvidence = 0;
  const signalCounts: Record<string, number> = {
    strong: 0,
    moderate: 0,
    contextual: 0,
  };

  for (const node of nodes) {
    let nodeHasEvidence = false;
    for (const benchmark of node.benchmarks) {
      if (benchmark.assessmentMethods) {
        for (const method of benchmark.assessmentMethods) {
          methodSet.add(method);
        }
      }
      if (benchmark.evidence && benchmark.evidence.length > 0) {
        nodeHasEvidence = true;
        for (const ev of benchmark.evidence) {
          signalCounts[ev.signal] = (signalCounts[ev.signal] ?? 0) + 1;
        }
      }
    }
    if (nodeHasEvidence) {
      nodesWithEvidence++;
    }
  }

  const methods = Array.from(methodSet).sort();
  const totalEvidence =
    signalCounts.strong + signalCounts.moderate + signalCounts.contextual;
  const hasData = methods.length > 0 || totalEvidence > 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        Assessment Framework
      </h3>

      {hasData ? (
        <div className="space-y-3">
          {/* Assessment methods */}
          {methods.length > 0 && (
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Methods Used
              </p>
              <div className="flex flex-wrap gap-1.5">
                {methods.map((method) => (
                  <span
                    key={method}
                    className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    {ASSESSMENT_METHOD_LABELS[method] ?? method}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Evidence coverage */}
          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {nodesWithEvidence} of {nodes.length}
            </span>{" "}
            nodes have structured evidence
          </p>

          {/* Signal quality breakdown */}
          {totalEvidence > 0 && (
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Signal Quality
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(["strong", "moderate", "contextual"] as const).map(
                  (signal) =>
                    signalCounts[signal] > 0 && (
                      <span
                        key={signal}
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${SIGNAL_LABELS[signal].classes}`}
                      >
                        {signalCounts[signal]} {SIGNAL_LABELS[signal].label.toLowerCase()}
                      </span>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Evidence and assessment criteria coming soon.{" "}
          <a
            href="https://github.com/OpenSkillTree/OpenSkillTree/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-zinc-300 underline-offset-2 hover:text-zinc-600 dark:decoration-zinc-600 dark:hover:text-zinc-300"
          >
            Contribute on GitHub
          </a>
        </p>
      )}
    </div>
  );
}
