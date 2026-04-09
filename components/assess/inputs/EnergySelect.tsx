"use client";

interface EnergySelectProps {
  selected: string | null;
  onSelect: (value: string) => void;
}

const ENERGY_OPTIONS = [
  { id: "drained", label: "Drained", icon: "\u2193", color: "text-red-500 dark:text-red-400" },
  { id: "neutral", label: "Neutral", icon: "\u2192", color: "text-zinc-400 dark:text-zinc-500" },
  { id: "energized", label: "Energized", icon: "\u2191", color: "text-emerald-500 dark:text-emerald-400" },
];

export default function EnergySelect({ selected, onSelect }: EnergySelectProps) {
  return (
    <div className="mt-4 flex gap-3">
      {ENERGY_OPTIONS.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={[
              "flex-1 rounded-xl border px-4 py-4 text-center transition-all",
              isSelected
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                : "border-zinc-200 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-900",
            ].join(" ")}
          >
            <div className={`text-lg ${isSelected ? "" : opt.color}`}>{opt.icon}</div>
            <div className="mt-1 text-sm font-medium">{opt.label}</div>
          </button>
        );
      })}
    </div>
  );
}
