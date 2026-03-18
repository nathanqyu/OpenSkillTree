"use client";

const DOMAINS = [
  "All",
  "Sports",
  "Technology",
  "Creative Arts",
  "Business",
  "Science",
] as const;

interface DomainFilterProps {
  selected: string;
  counts: Record<string, number>;
  onChange: (domain: string) => void;
}

export default function DomainFilter({
  selected,
  counts,
  onChange,
}: DomainFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {DOMAINS.map((domain) => {
        const count = domain === "All" ? undefined : counts[domain];
        const active = selected === domain;
        return (
          <button
            key={domain}
            onClick={() => onChange(domain)}
            className={[
              "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "border border-zinc-300 text-zinc-600 hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-400",
            ].join(" ")}
          >
            {domain}
            {count !== undefined && (
              <span className="ml-1.5 text-xs opacity-70">({count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
