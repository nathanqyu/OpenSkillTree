"use client";

import type { TraitScores, Trait } from "@/lib/discover-engine";

const ALL_TRAITS: Trait[] = [
  "physical",
  "creative",
  "analytical",
  "social",
  "strategic",
  "patience",
  "competitive",
  "expressive",
  "technical",
  "wellness",
  "naturalistic",
];

const TRAIT_SHORT_LABELS: Record<Trait, string> = {
  physical: "Physical",
  creative: "Creative",
  analytical: "Analytical",
  social: "Social",
  strategic: "Strategic",
  patience: "Patience",
  competitive: "Competitive",
  expressive: "Expressive",
  technical: "Technical",
  wellness: "Wellness",
  naturalistic: "Nature",
};

interface TraitRadarProps {
  interest: TraitScores;
  aptitude: TraitScores;
  size?: number;
}

/**
 * SVG radar chart showing 11 trait dimensions.
 * Two polygons: interest (blue) and aptitude (emerald).
 */
export default function TraitRadar({
  interest,
  aptitude,
  size = 280,
}: TraitRadarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 40;
  const n = ALL_TRAITS.length;

  // Normalize scores to 0-1 range
  const maxVal = Math.max(
    1,
    ...ALL_TRAITS.map((t) => Math.max(interest[t] ?? 0, aptitude[t] ?? 0)),
  );

  function getPoint(index: number, value: number): [number, number] {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const r = (value / maxVal) * radius;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  function polygon(scores: TraitScores): string {
    return ALL_TRAITS.map((t, i) => {
      const [x, y] = getPoint(i, scores[t] ?? 0);
      return `${x},${y}`;
    }).join(" ");
  }

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Trait profile radar chart showing interest and aptitude across 11 dimensions">
        {/* Grid rings */}
        {rings.map((r) => (
          <polygon
            key={r}
            points={ALL_TRAITS.map((_, i) => {
              const [x, y] = getPoint(i, maxVal * r);
              return `${x},${y}`;
            }).join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth={0.5}
            className="text-zinc-200 dark:text-zinc-800"
          />
        ))}

        {/* Axis lines */}
        {ALL_TRAITS.map((_, i) => {
          const [x, y] = getPoint(i, maxVal);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth={0.5}
              className="text-zinc-200 dark:text-zinc-800"
            />
          );
        })}

        {/* Interest polygon */}
        <polygon
          points={polygon(interest)}
          fill="rgba(96, 165, 250, 0.15)"
          stroke="rgb(96, 165, 250)"
          strokeWidth={1.5}
        />

        {/* Aptitude polygon */}
        <polygon
          points={polygon(aptitude)}
          fill="rgba(52, 211, 153, 0.15)"
          stroke="rgb(52, 211, 153)"
          strokeWidth={1.5}
        />

        {/* Labels */}
        {ALL_TRAITS.map((t, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          const labelR = radius + 22;
          const x = cx + labelR * Math.cos(angle);
          const y = cy + labelR * Math.sin(angle);
          return (
            <text
              key={t}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-zinc-500 dark:fill-zinc-400"
              fontSize={9}
              fontWeight={500}
            >
              {TRAIT_SHORT_LABELS[t]}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-2 flex gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-blue-400" />
          <span className="text-zinc-500 dark:text-zinc-400">Interest</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-zinc-500 dark:text-zinc-400">Aptitude</span>
        </div>
      </div>
    </div>
  );
}
