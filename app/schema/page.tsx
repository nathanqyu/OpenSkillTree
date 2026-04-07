import Link from "next/link";

export const metadata = {
  title: "Schema Reference — OpenSkillTree",
  description:
    "Complete reference for the OpenSkillTree YAML schema. Learn how to structure skill trees, nodes, benchmarks, and relationships.",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function SectionAnchor({ id }: { id: string }) {
  return <span id={id} className="-mt-20 block pt-20" />;
}

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
      <code>{children.trim()}</code>
    </pre>
  );
}

function Badge({
  children,
  color = "zinc",
}: {
  children: React.ReactNode;
  color?: "zinc" | "blue" | "green" | "amber" | "red" | "purple";
}) {
  const colors = {
    zinc: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    green: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    red: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    purple:
      "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  };
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 font-mono text-xs font-medium ${colors[color]}`}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SchemaPage() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Home
          </Link>
          <span className="mx-1.5">›</span>
          <span>Schema Reference</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Skill Tree Schema Reference
        </h1>
        <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400">
          Everything you need to contribute a skill tree. Each file is a single
          YAML document validated against{" "}
          <a
            href="https://github.com/nathanqyu/OpenSkillTree/blob/main/schema/skill-tree.schema.json"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900 dark:decoration-zinc-600 dark:hover:text-zinc-50"
          >
            skill-tree.schema.json
          </a>
          .
        </p>
      </div>

      <div className="flex gap-10">
        {/* TOC */}
        <aside className="hidden w-48 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1 text-sm">
            <p className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
              On this page
            </p>
            {[
              ["#overview", "Overview"],
              ["#tree-metadata", "Tree metadata"],
              ["#nodes", "Nodes"],
              ["#benchmarks", "Benchmarks"],
              ["#relationships", "Relationships"],
              ["#domains", "Domain taxonomy"],
              ["#example", "Full example"],
              ["#validation", "Validation & mistakes"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="block text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1 space-y-14">
          {/* Overview */}
          <section>
            <SectionAnchor id="overview" />
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Overview
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Each skill tree lives in a single YAML file under{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">
                data/seeds/&lt;domain&gt;/&lt;name&gt;.yaml
              </code>
              . A valid file has three top-level keys:
            </p>
            <Code>{`
tree:          # required — metadata about the skill tree
  id: "sports/pickleball"
  title: "Pickleball"
  domain: "Sports"
  description: >
    A complete skill map for pickleball …

nodes:         # required — array of skill nodes (min 1)
  - id: "sports/pickleball/serve"
    title: "Serve"
    description: >
      The serve starts every rally …
    benchmarks:
      - level: beginner
        criteria: "Gets serve in play consistently."

relationships: # optional — directed edges between nodes
  - source: "sports/pickleball/footwork"
    target: "sports/pickleball/serve"
    type: "enables"
            `}</Code>
          </section>

          {/* Tree metadata */}
          <section>
            <SectionAnchor id="tree-metadata" />
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Tree metadata
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              The <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">tree</code> block
              describes the skill tree as a whole.
            </p>
            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                    <th className="px-4 py-2.5">Field</th>
                    <th className="px-4 py-2.5">Type</th>
                    <th className="px-4 py-2.5">Required</th>
                    <th className="px-4 py-2.5">Description</th>
                  </tr>
                </thead>
                <tbody className="px-4">
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-4 py-2.5 align-top font-mono text-sm text-zinc-900 dark:text-zinc-100">id</td>
                    <td className="px-4 py-2.5 align-top"><Badge color="blue">path-id</Badge></td>
                    <td className="px-4 py-2.5 align-top text-xs"><Badge color="red">required</Badge></td>
                    <td className="px-4 py-2.5 align-top text-sm text-zinc-600 dark:text-zinc-400">
                      Globally unique path like <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">sports/pickleball</code>. Lowercase alphanumeric + hyphens, slash-separated.
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-4 py-2.5 align-top font-mono text-sm text-zinc-900 dark:text-zinc-100">title</td>
                    <td className="px-4 py-2.5 align-top"><Badge color="blue">string</Badge></td>
                    <td className="px-4 py-2.5 align-top text-xs"><Badge color="red">required</Badge></td>
                    <td className="px-4 py-2.5 align-top text-sm text-zinc-600 dark:text-zinc-400">Human-readable name (max 255 chars).</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-4 py-2.5 align-top font-mono text-sm text-zinc-900 dark:text-zinc-100">description</td>
                    <td className="px-4 py-2.5 align-top"><Badge color="blue">string</Badge></td>
                    <td className="px-4 py-2.5 align-top text-xs"><Badge color="red">required</Badge></td>
                    <td className="px-4 py-2.5 align-top text-sm text-zinc-600 dark:text-zinc-400">A short summary of what the tree covers. Use YAML block scalar (<code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">&gt;</code>) for multi-line.</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-4 py-2.5 align-top font-mono text-sm text-zinc-900 dark:text-zinc-100">domain</td>
                    <td className="px-4 py-2.5 align-top"><Badge color="blue">enum</Badge></td>
                    <td className="px-4 py-2.5 align-top text-xs"><Badge color="red">required</Badge></td>
                    <td className="px-4 py-2.5 align-top text-sm text-zinc-600 dark:text-zinc-400">
                      One of: <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">Sports</code> · <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">Technology</code> · <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">Creative Arts</code> · <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">Business</code> · <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">Science</code>.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 align-top font-mono text-sm text-zinc-900 dark:text-zinc-100">visibility</td>
                    <td className="px-4 py-2.5 align-top"><Badge color="blue">enum</Badge></td>
                    <td className="px-4 py-2.5 align-top text-xs"><Badge color="zinc">optional</Badge></td>
                    <td className="px-4 py-2.5 align-top text-sm text-zinc-600 dark:text-zinc-400">
                      <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">public</code> (default) · <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">unlisted</code> · <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">private</code>.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
              Path ID pattern:{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">
                ^[a-z0-9]+(/[a-z0-9-]+)+$
              </code>
            </p>
          </section>

          {/* Nodes */}
          <section>
            <SectionAnchor id="nodes" />
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Nodes
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Each item in the <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">nodes</code> array represents a distinct skill.
              At least one node is required per tree.
            </p>
            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                    <th className="px-4 py-2.5">Field</th>
                    <th className="px-4 py-2.5">Type</th>
                    <th className="px-4 py-2.5">Required</th>
                    <th className="px-4 py-2.5">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-4 py-2.5 align-top font-mono text-sm text-zinc-900 dark:text-zinc-100">id</td>
                    <td className="px-4 py-2.5 align-top"><Badge color="blue">path-id</Badge></td>
                    <td className="px-4 py-2.5 align-top text-xs"><Badge color="red">required</Badge></td>
                    <td className="px-4 py-2.5 align-top text-sm text-zinc-600 dark:text-zinc-400">Globally unique. Must start with the tree ID prefix, e.g. <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">sports/pickleball/serve</code>.</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-4 py-2.5 align-top font-mono text-sm text-zinc-900 dark:text-zinc-100">title</td>
                    <td className="px-4 py-2.5 align-top"><Badge color="blue">string</Badge></td>
                    <td className="px-4 py-2.5 align-top text-xs"><Badge color="red">required</Badge></td>
                    <td className="px-4 py-2.5 align-top text-sm text-zinc-600 dark:text-zinc-400">Human-readable skill name (max 255 chars).</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-4 py-2.5 align-top font-mono text-sm text-zinc-900 dark:text-zinc-100">description</td>
                    <td className="px-4 py-2.5 align-top"><Badge color="blue">string</Badge></td>
                    <td className="px-4 py-2.5 align-top text-xs"><Badge color="red">required</Badge></td>
                    <td className="px-4 py-2.5 align-top text-sm text-zinc-600 dark:text-zinc-400">What this skill is and why it matters.</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-4 py-2.5 align-top font-mono text-sm text-zinc-900 dark:text-zinc-100">benchmarks</td>
                    <td className="px-4 py-2.5 align-top"><Badge color="blue">array</Badge></td>
                    <td className="px-4 py-2.5 align-top text-xs"><Badge color="red">required</Badge></td>
                    <td className="px-4 py-2.5 align-top text-sm text-zinc-600 dark:text-zinc-400">At least one benchmark. Defines what mastery looks like at each level.</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-4 py-2.5 align-top font-mono text-sm text-zinc-900 dark:text-zinc-100">icon</td>
                    <td className="px-4 py-2.5 align-top"><Badge color="blue">string</Badge></td>
                    <td className="px-4 py-2.5 align-top text-xs"><Badge color="zinc">optional</Badge></td>
                    <td className="px-4 py-2.5 align-top text-sm text-zinc-600 dark:text-zinc-400">Lucide icon name, emoji, or image URL.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 align-top font-mono text-sm text-zinc-900 dark:text-zinc-100">tags</td>
                    <td className="px-4 py-2.5 align-top"><Badge color="blue">string[]</Badge></td>
                    <td className="px-4 py-2.5 align-top text-xs"><Badge color="zinc">optional</Badge></td>
                    <td className="px-4 py-2.5 align-top text-sm text-zinc-600 dark:text-zinc-400">Free-text tags for filtering and discovery.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <Code>{`
nodes:
  - id: "sports/pickleball/serve"
    title: "Serve"
    description: >
      The serve starts every rally. In pickleball, the serve must land
      in the diagonal service box and clear the kitchen (NVZ).
    benchmarks:
      - level: beginner
        criteria: "Gets serve in play consistently. Legal underhand motion."
        metrics:
          - "70%+ serve in rate"
    icon: "🏓"
    tags: ["technical", "offensive", "measurable"]
              `}</Code>
            </div>
          </section>

          {/* Benchmarks */}
          <section>
            <SectionAnchor id="benchmarks" />
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Benchmarks
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Benchmarks define observable, measurable mastery criteria at a given
              skill level. They are the core of what makes OpenSkillTree useful — a
              learner can look at any node and know exactly what they need to
              demonstrate to advance.
            </p>

            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              {[
                {
                  level: "beginner",
                  color: "green",
                  desc: "Can perform the skill with guidance. Focused on correctness over fluency.",
                },
                {
                  level: "intermediate",
                  color: "blue",
                  desc: "Reliable under normal conditions. Developing consistency and context-awareness.",
                },
                {
                  level: "advanced",
                  color: "amber",
                  desc: "Consistently excellent. Adapts the skill under pressure or in edge cases.",
                },
                {
                  level: "expert",
                  color: "red",
                  desc: "Mastery. Teaches others, innovates, and performs at the highest level.",
                },
              ].map(({ level, color, desc }) => (
                <div
                  key={level}
                  className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                >
                  <div className="mb-1">
                    <Badge
                      color={
                        color as "green" | "blue" | "amber" | "red"
                      }
                    >
                      {level}
                    </Badge>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                    <th className="px-4 py-2.5">Field</th>
                    <th className="px-4 py-2.5">Type</th>
                    <th className="px-4 py-2.5">Required</th>
                    <th className="px-4 py-2.5">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-4 py-2.5 align-top font-mono text-sm text-zinc-900 dark:text-zinc-100">level</td>
                    <td className="px-4 py-2.5 align-top"><Badge color="blue">enum</Badge></td>
                    <td className="px-4 py-2.5 align-top text-xs"><Badge color="red">required</Badge></td>
                    <td className="px-4 py-2.5 align-top text-sm text-zinc-600 dark:text-zinc-400"><code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">beginner</code> · <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">intermediate</code> · <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">advanced</code> · <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">expert</code></td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-4 py-2.5 align-top font-mono text-sm text-zinc-900 dark:text-zinc-100">criteria</td>
                    <td className="px-4 py-2.5 align-top"><Badge color="blue">string</Badge></td>
                    <td className="px-4 py-2.5 align-top text-xs"><Badge color="red">required</Badge></td>
                    <td className="px-4 py-2.5 align-top text-sm text-zinc-600 dark:text-zinc-400">Human-readable description of what mastery looks like at this level. Should be observable and specific.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 align-top font-mono text-sm text-zinc-900 dark:text-zinc-100">metrics</td>
                    <td className="px-4 py-2.5 align-top"><Badge color="blue">string[]</Badge></td>
                    <td className="px-4 py-2.5 align-top text-xs"><Badge color="zinc">optional</Badge></td>
                    <td className="px-4 py-2.5 align-top text-sm text-zinc-600 dark:text-zinc-400">Quantitative targets with units, e.g. <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">&quot;70%+ serve in rate&quot;</code> or <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">&quot;≤ 3 errors per session&quot;</code>.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <Code>{`
benchmarks:
  - level: beginner
    criteria: "Gets serve in play consistently. Legal underhand motion."
    metrics:
      - "70%+ serve in rate (7/10 serves land in)"

  - level: intermediate
    criteria: "Directional serve placement — can target wide, middle, or at body."
    metrics:
      - "85%+ serve in rate"
      - "Hits intended target zone 6/10 serves"

  - level: advanced
    criteria: "Varied spin and pace serves (topspin, slice, power)."
    metrics:
      - "90%+ serve in rate"
      - "Can execute 3+ distinct serve types on command"

  - level: expert
    criteria: "Serve as a strategic weapon. Disguises spin direction."
    metrics:
      - "93%+ serve in rate under match pressure"
      - "Ace or unreturnable serve rate ≥ 5% at tournament level"
              `}</Code>
            </div>

            <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
              <strong>Tip:</strong> You don&apos;t need all four levels for every
              node. A single well-written benchmark is valid. However, including
              all four levels makes the tree most useful for learners at any
              stage.
            </div>
          </section>

          {/* Relationships */}
          <section>
            <SectionAnchor id="relationships" />
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Relationships
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              The optional <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">relationships</code> array defines directed edges between
              nodes. Each edge has a source, target, and a type that describes how
              the two skills relate.
            </p>

            <div className="mb-4 space-y-2">
              {[
                {
                  type: "requires",
                  color: "red",
                  desc: "Target cannot be meaningfully attempted without source. Strong prerequisite.",
                  example: "Serve → Third Shot Drop (you need a reliable serve before executing a third shot drop)",
                },
                {
                  type: "enables",
                  color: "green",
                  desc: "Source makes target accessible or recommended, but is not a hard prerequisite.",
                  example: "Footwork → Serve (good footwork enables better serves)",
                },
                {
                  type: "component-of",
                  color: "blue",
                  desc: "Source is a sub-skill that composes or contributes to the target.",
                  example: "Doubles Communication → Strategy (communication is a component of overall game strategy)",
                },
                {
                  type: "complementary",
                  color: "purple",
                  desc: "Mutual reinforcement — practicing either skill helps the other.",
                  example: "Return of Serve ↔ Third Shot Drop (understanding returns helps anticipate where to drop)",
                },
                {
                  type: "variant-of",
                  color: "amber",
                  desc: "Parallel approaches that fulfill a similar role or goal.",
                  example: "Topspin Drive ↔ Slice Drive (two variants of the same power shot concept)",
                },
              ].map(({ type, color, desc, example }) => (
                <div
                  key={type}
                  className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <Badge
                      color={
                        color as
                          | "red"
                          | "green"
                          | "blue"
                          | "purple"
                          | "amber"
                          | "zinc"
                      }
                    >
                      {type}
                    </Badge>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{desc}</p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                    e.g. {example}
                  </p>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                    <th className="px-4 py-2.5">Field</th>
                    <th className="px-4 py-2.5">Type</th>
                    <th className="px-4 py-2.5">Required</th>
                    <th className="px-4 py-2.5">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-4 py-2.5 align-top font-mono text-sm text-zinc-900 dark:text-zinc-100">source</td>
                    <td className="px-4 py-2.5 align-top"><Badge color="blue">path-id</Badge></td>
                    <td className="px-4 py-2.5 align-top text-xs"><Badge color="red">required</Badge></td>
                    <td className="px-4 py-2.5 align-top text-sm text-zinc-600 dark:text-zinc-400">Path ID of the origin node. Must exist in the <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">nodes</code> array.</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-4 py-2.5 align-top font-mono text-sm text-zinc-900 dark:text-zinc-100">target</td>
                    <td className="px-4 py-2.5 align-top"><Badge color="blue">path-id</Badge></td>
                    <td className="px-4 py-2.5 align-top text-xs"><Badge color="red">required</Badge></td>
                    <td className="px-4 py-2.5 align-top text-sm text-zinc-600 dark:text-zinc-400">Path ID of the destination node. Must exist in the <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">nodes</code> array.</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="px-4 py-2.5 align-top font-mono text-sm text-zinc-900 dark:text-zinc-100">type</td>
                    <td className="px-4 py-2.5 align-top"><Badge color="blue">enum</Badge></td>
                    <td className="px-4 py-2.5 align-top text-xs"><Badge color="red">required</Badge></td>
                    <td className="px-4 py-2.5 align-top text-sm text-zinc-600 dark:text-zinc-400">One of the five relationship types above.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 align-top font-mono text-sm text-zinc-900 dark:text-zinc-100">note</td>
                    <td className="px-4 py-2.5 align-top"><Badge color="blue">string</Badge></td>
                    <td className="px-4 py-2.5 align-top text-xs"><Badge color="zinc">optional</Badge></td>
                    <td className="px-4 py-2.5 align-top text-sm text-zinc-600 dark:text-zinc-400">Human-readable explanation of why this edge exists.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <Code>{`
relationships:
  - source: "sports/pickleball/footwork"
    target: "sports/pickleball/serve"
    type: "enables"
    note: "Stable base and weight transfer are required for a reliable serve"

  - source: "sports/pickleball/serve"
    target: "sports/pickleball/third-shot-drop"
    type: "requires"
    note: "Third shot drop is only executed by the serving team"
              `}</Code>
            </div>
          </section>

          {/* Domains */}
          <section>
            <SectionAnchor id="domains" />
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Domain taxonomy
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              V1 has a fixed domain list. Each tree belongs to exactly one domain.
              To propose a new domain, open a GitHub Discussion tagged{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">
                domain-proposal
              </code>
              .
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  domain: "Sports",
                  color: "green",
                  examples: "Pickleball, Basketball, Swimming, Rock Climbing",
                },
                {
                  domain: "Technology",
                  color: "blue",
                  examples: "Python, React, System Design, Data Engineering",
                },
                {
                  domain: "Creative Arts",
                  color: "purple",
                  examples: "Photography, Illustration, Music Production",
                },
                {
                  domain: "Business",
                  color: "amber",
                  examples: "Product Management, Sales, LinkedIn Content",
                },
                {
                  domain: "Science",
                  color: "red",
                  examples: "Statistics, Chemistry, Scientific Writing",
                },
              ].map(({ domain, color, examples }) => (
                <div
                  key={domain}
                  className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                >
                  <div className="mb-1">
                    <Badge
                      color={
                        color as
                          | "green"
                          | "blue"
                          | "purple"
                          | "amber"
                          | "red"
                      }
                    >
                      {domain}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    {examples}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Full example */}
          <section>
            <SectionAnchor id="example" />
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Full example
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              A minimal but valid skill tree for{" "}
              <Link
                href="/trees/sports%2Fpickleball"
                className="underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900 dark:decoration-zinc-600 dark:hover:text-zinc-50"
              >
                Pickleball
              </Link>
              , trimmed to three nodes:
            </p>
            <Code>{`
# data/seeds/sports/pickleball.yaml

tree:
  id: "sports/pickleball"
  title: "Pickleball"
  description: >
    A complete skill map for pickleball — a fast-growing paddle sport
    combining elements of tennis, badminton, and table tennis.
  domain: "Sports"
  visibility: "public"

nodes:
  - id: "sports/pickleball/footwork"
    title: "Footwork & Movement"
    description: >
      The foundation of all pickleball skills. Efficient movement enables
      you to reach balls, set up for shots, and recover to position.
    benchmarks:
      - level: beginner
        criteria: "Moves to ball and makes contact without losing balance."
        metrics:
          - "Reaches 7/10 balls hit within 2 steps"
      - level: intermediate
        criteria: "Consistent split step on every return."
        metrics:
          - "Split step timed within 0.3s of opponent contact on 8/10 shots"
    tags: ["foundation", "athletic"]

  - id: "sports/pickleball/serve"
    title: "Serve"
    description: >
      The serve starts every rally and must land in the diagonal service
      box, clearing the kitchen (NVZ).
    benchmarks:
      - level: beginner
        criteria: "Gets serve in play consistently. Legal underhand motion."
        metrics:
          - "70%+ serve in rate"
      - level: intermediate
        criteria: "Directional serve placement — can target wide, middle, or at body."
        metrics:
          - "85%+ serve in rate"
          - "Hits intended target zone 6/10 serves"
    tags: ["technical", "offensive"]

  - id: "sports/pickleball/third-shot-drop"
    title: "Third Shot Drop"
    description: >
      The most important shot in pickleball. A soft arc that lands in the
      kitchen, allowing the serving team to advance to the net.
    benchmarks:
      - level: beginner
        criteria: "Lands in kitchen at least 40% of the time from mid-court."
        metrics:
          - "Lands in kitchen on 4/10 third-shot attempts"
      - level: intermediate
        criteria: "Consistent drops from baseline. Moves forward after drop."
        metrics:
          - "65%+ kitchen landing rate"
    tags: ["signature-shot", "critical-path"]

relationships:
  - source: "sports/pickleball/footwork"
    target: "sports/pickleball/serve"
    type: "enables"
    note: "Stable base and weight transfer are required for a reliable serve"

  - source: "sports/pickleball/serve"
    target: "sports/pickleball/third-shot-drop"
    type: "requires"
    note: "Third shot drop is only executed by the serving team"
            `}</Code>
          </section>

          {/* Validation */}
          <section>
            <SectionAnchor id="validation" />
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Validation rules &amp; common mistakes
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Run{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">
                pnpm ingest
              </code>{" "}
              to validate and ingest your file. The ingest script uses AJV to
              validate against the JSON Schema before writing to the database.
            </p>

            <div className="space-y-3">
              {[
                {
                  title: "Node IDs must be globally unique",
                  bad: `id: "serve"  # ✗ — missing domain/tree prefix`,
                  good: `id: "sports/pickleball/serve"  # ✓`,
                },
                {
                  title: "Relationship nodes must exist in the same file",
                  bad: `source: "sports/tennis/footwork"  # ✗ — cross-tree (not supported in V1)`,
                  good: `source: "sports/pickleball/footwork"  # ✓ — same tree`,
                },
                {
                  title: "Domain must match the exact enum value (case-sensitive)",
                  bad: `domain: "sports"  # ✗ — lowercase not accepted`,
                  good: `domain: "Sports"  # ✓`,
                },
                {
                  title: "Benchmark level must be a valid enum",
                  bad: `level: "pro"  # ✗ — not a valid level`,
                  good: `level: "expert"  # ✓`,
                },
                {
                  title: "At least one node and one benchmark are required",
                  bad: `nodes: []  # ✗ — empty nodes array`,
                  good: `nodes:\n  - id: "…"\n    benchmarks: [ … ]  # ✓`,
                },
              ].map(({ title, bad, good }) => (
                <div
                  key={title}
                  className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                >
                  <p className="mb-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {title}
                  </p>
                  <div className="space-y-2">
                    <pre className="overflow-x-auto rounded bg-red-50 p-3 text-xs text-red-800 dark:bg-red-950 dark:text-red-300">
                      <code>{bad}</code>
                    </pre>
                    <pre className="overflow-x-auto rounded bg-green-50 p-3 text-xs text-green-800 dark:bg-green-950 dark:text-green-300">
                      <code>{good}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
              <p className="mb-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                Ingest commands
              </p>
              <Code>{`
# Validate and ingest all seed files
pnpm ingest

# Ingest a specific domain folder
pnpm ingest data/seeds/sports/

# Force re-ingest even if file content hasn't changed
pnpm ingest --force
              `}</Code>
            </div>
          </section>

          {/* Footer CTA */}
          <div className="rounded-lg border border-zinc-200 p-6 text-center dark:border-zinc-700">
            <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
              Ready to contribute? Read the full contribution guide.
            </p>
            <a
              href="https://github.com/nathanqyu/OpenSkillTree/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              View CONTRIBUTING.md
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
