# Contributing to OpenSkillTree

Community contributions are the growth engine of OpenSkillTree. This guide explains how domain experts — coaches, practitioners, certified instructors, and professionals — can contribute new skill trees.

---

## Who Should Contribute

You are the right contributor if you:

- Are a **domain expert**: a certified coach, practitioner, instructor, or professional with verifiable experience in a field
- Can ground skill benchmarks in **real frameworks, certifications, or measurable industry data** (not opinion or anecdote)
- Are willing to iterate on feedback from the review team

Examples of strong contributors: a USTA-certified tennis coach, a CISA-certified security professional, a PMP-certified project manager, a professional chef who teaches in an accredited program.

---

## Before You Start

Check the existing trees in `data/seeds/` to avoid duplication. If a tree for your domain already exists, consider opening an issue to discuss extending it rather than creating a new one.

---

## Fork + PR Workflow

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/OpenSkillTree.git
   cd OpenSkillTree
   ```
3. **Create a branch** for your skill tree:
   ```bash
   git checkout -b add/sports/tennis
   ```
4. **Create your YAML file** following the guide below.
5. **Validate** the file locally (see [Validation](#validation)).
6. **Commit and push**:
   ```bash
   git add data/seeds/<domain>/<tree-slug>.yaml
   git commit -m "feat: add sports/tennis skill tree"
   git push origin add/sports/tennis
   ```
7. **Open a Pull Request** against `main`. Fill in the PR template — include your credentials and the sources for each benchmark level.

---

## Naming Conventions

| What | Convention | Example |
|------|-----------|---------|
| File path | `data/seeds/{domain}/{tree-slug}.yaml` | `data/seeds/sports/tennis.yaml` |
| Domain folder | lowercase, single word | `sports`, `technology`, `business`, `creative-arts` |
| Tree slug | lowercase, hyphenated | `tennis`, `machine-learning`, `public-speaking` |
| Tree ID | `{domain}/{tree-slug}` | `"sports/tennis"` |
| Node ID | `{domain}/{tree-slug}/{node-slug}` | `"sports/tennis/serve"` |

---

## Step-by-Step: Creating a Skill Tree YAML

### Step 1 — Define the tree metadata

Every file starts with a comment header and a `tree` block:

```yaml
# OpenSkillTree — Seed Skill Tree: Tennis
#
# Domain:  Sports / Racket Sports / Tennis
# Author:  Your Name
# Version: 0.1.0
#
# Benchmark reference: <source, e.g. ITF Player Development framework>

tree:
  id: "sports/tennis"
  title: "Tennis"
  description: >
    A complete skill map for tennis — covering groundstrokes, serve, net play,
    footwork, and match strategy from beginner to competitive level.
  domain: "Sports"
  visibility: "public"
```

### Step 2 — Define skill nodes

Each `node` represents one discrete, teachable skill:

```yaml
nodes:
  - id: "sports/tennis/serve"
    title: "Serve"
    description: >
      The serve opens every point. A reliable serve creates immediate
      offensive pressure and is the single most important shot in tennis.
    benchmarks:
      - level: beginner
        criteria: "Gets serve in play consistently using a continental grip. Legal toss and swing path."
        metrics:
          - "60%+ first serve in rate"
      - level: intermediate
        criteria: "Directional placement — can target T, body, or wide on command. Consistent depth past the service line."
        metrics:
          - "75%+ first serve in rate"
          - "Hits intended target zone 6/10 serves"
      - level: advanced
        criteria: "Varied spin: flat, slice, and kick serve. Serve placement disrupts opponent positioning."
        metrics:
          - "85%+ first serve in rate"
          - "Executes 3 distinct serve types on command"
          - "Forces weak return on 3/10 serves"
      - level: expert
        criteria: "Serve as a strategic weapon. Disguises spin direction. Uses opponent tendencies to dictate serve patterns."
        metrics:
          - "88%+ first serve in rate under match pressure"
          - "Ace or unreturnable serve rate ≥ 8% at club/tournament level"
    tags: ["technical", "offensive", "measurable"]
```

Aim for **6–12 nodes** per tree. Each node should be independently learnable and meaningfully distinct from others.

### Step 3 — Define relationships

Relationships create the graph structure — they tell learners what to practice first:

```yaml
relationships:
  - source: "sports/tennis/footwork"
    target: "sports/tennis/serve"
    type: "enables"
    note: "Stable base and weight transfer are required for a reliable serve"

  - source: "sports/tennis/serve"
    target: "sports/tennis/return-of-serve"
    type: "complementary"
    note: "Understanding your own serve mechanics improves return reads"
```

**Relationship types:**

| Type | Meaning |
|------|---------|
| `requires` | Prerequisite — must be developed first |
| `enables` | Practicing this skill opens up the next one |
| `component-of` | Sub-skill that composes into a parent skill |
| `complementary` | Cross-skill benefit without a strict order |
| `variant-of` | Parallel skill at a similar level |

---

## How to Define Benchmarks

Every node must have **all four levels**: `beginner`, `intermediate`, `advanced`, `expert`.

**The cardinal rule: every level must have at least one number.**

If your domain has a recognized rating or certification scale (DUPR, ITF, IELTS, AWS certifications), anchor each level to it in the file's top comment and in `criteria`. If no scale exists, define a measurable threshold — a pass rate, count per session, error rate, or time.

| Level | Guideline |
|-------|-----------|
| `beginner` | Just started; can execute the skill with errors. Basic form established. |
| `intermediate` | Consistent execution in practice. Directional control. Applies skill in context. |
| `advanced` | Competitive performance. Executes under pressure. Multiple variations. |
| `expert` | Professional / elite level. Skill is a weapon, not just reliable. |

**What to put in `criteria`:** A qualitative description of what observable behavior looks like at this level. Written from the observer's point of view ("Player does X", not "You can do X").

**What to put in `metrics`:** One or more quantitative thresholds. Must reference a real standard or be measurable in a practice session. Examples:
- `"85%+ first serve in rate"` ✓
- `"Completes 10 reps at 75% of 1RM"` ✓
- `"Score of 7.0+ on IELTS Writing"` ✓
- `"Good at it"` ✗

**Sources required.** At minimum, each tree file must cite its benchmark sources in the top comment block. Acceptable sources: official certification bodies, national governing organizations, peer-reviewed literature, industry standard leveling frameworks (e.g., Reforge, CEFR, DUPR). Opinion-only benchmarks will be rejected in review.

---

## Full YAML Template

Copy this template and fill it in:

```yaml
# OpenSkillTree — Seed Skill Tree: <Title>
#
# Domain:  <Category> / <Subcategory> / <Skill>
# Author:  <Your Name>
# Version: 0.1.0
#
# Benchmark reference: <Source — e.g., "CEFR language levels", "AWS certification tiers">
#   beginner     ≈ <what this maps to in the reference framework>
#   intermediate ≈ <what this maps to>
#   advanced     ≈ <what this maps to>
#   expert       ≈ <what this maps to>

tree:
  id: "<domain>/<tree-slug>"
  title: "<Human-Readable Title>"
  description: >
    <2–4 sentence description of the skill domain. What does this tree cover?
    Who is it for? What does progression look like?>
  domain: "<Domain>"      # e.g., "Sports", "Technology", "Business", "Creative Arts"
  visibility: "public"

nodes:
  - id: "<domain>/<tree-slug>/<node-slug>"
    title: "<Skill Name>"
    description: >
      <1–3 sentence description. What is this skill? Why does it matter
      in the context of the broader domain?>
    benchmarks:
      - level: beginner
        criteria: "<Observable behavior at beginner level.>"
        metrics:
          - "<Quantitative threshold — e.g., '60%+ success rate'>"
      - level: intermediate
        criteria: "<Observable behavior at intermediate level.>"
        metrics:
          - "<Metric 1>"
          - "<Metric 2 (optional)>"
      - level: advanced
        criteria: "<Observable behavior at advanced level.>"
        metrics:
          - "<Metric 1>"
          - "<Metric 2 (optional)>"
      - level: expert
        criteria: "<Observable behavior at expert level.>"
        metrics:
          - "<Metric — referenced to a real standard or competition context>"
    tags: ["<tag1>", "<tag2>"]   # optional; searchable labels

  # Add 5–11 more nodes following the same pattern...

relationships:
  - source: "<domain>/<tree-slug>/<source-node>"
    target: "<domain>/<tree-slug>/<target-node>"
    type: "requires"    # requires | enables | component-of | complementary | variant-of
    note: "<One sentence explaining why this relationship exists.>"

  # Add more relationships...
```

---

## Example Walkthrough: Pickleball Tree

The pickleball tree (`data/seeds/sports/pickleball.yaml`) is the reference example. Here is what makes it good:

**Benchmark anchoring.** The top comment maps each level to the DUPR rating system (a real, widely-used pickleball rating). Reviewers and learners can immediately understand what each level means in context.

**Quantitative metrics at every level.** Even at `beginner`, the criteria include a number: `"70%+ serve in rate (7/10 serves land in)"`. This is the minimum bar — every level must have at least one measurable threshold.

**Node descriptions explain *why* the skill matters.** The Third Shot Drop node opens with: *"The third shot drop is the most important shot in pickleball."* This gives learners context for why they should prioritize this node.

**Relationships are typed and annotated.** Every edge has a `type` and a `note` explaining the reasoning. This isn't just a graph — it's documented pedagogy.

**Tags are used consistently.** Tags like `"measurable"`, `"foundation"`, `"advanced"` help the platform surface and filter content.

---

## Validation

Before submitting your PR, validate your YAML file to catch schema errors:

```bash
npm run validate-seed data/seeds/<domain>/<tree-slug>.yaml
```

> **Note:** The schema validator script is under development. Until it is available, you can manually verify your file by:
> 1. Checking indentation: the YAML must be valid — use a YAML linter (e.g., `yamllint`)
> 2. Confirming all four benchmark levels (`beginner`, `intermediate`, `advanced`, `expert`) are present on every node
> 3. Confirming every `metrics` array has at least one entry per level
> 4. Confirming all `relationships` reference valid node IDs that exist in your `nodes` block
> 5. Confirming the `tree.id`, all `node.id` values, and relationship `source`/`target` fields follow the `domain/tree-slug/node-slug` naming convention

A link to the formal schema documentation will be added here once published.

---

## Review Process

After you open a PR, here is what to expect:

1. **Automated checks** run on your YAML (formatting, schema validity). Fix any failures before requesting review.
2. **A maintainer** will review the benchmark sources. Be prepared to link to or quote the source material for each level threshold.
3. **Domain review** (where applicable): for specialized technical domains we may request a second opinion from another domain expert.
4. **Feedback round**: most PRs go through 1–2 rounds of revision — typically to sharpen metrics, adjust level thresholds, or add missing relationships.
5. **Merge**: once approved, your tree is merged and published.

**Typical timeline:** 5–10 business days for initial feedback. Complex trees or unfamiliar domains may take longer.

---

## Quality Bar

PRs will be rejected if they:

- Use vague, non-measurable metrics ("good at it", "understands the concept")
- Lack source citations for benchmark levels
- Are missing any of the four benchmark levels on any node
- Use incorrect naming conventions (wrong path, uppercase slugs, etc.)
- Duplicate an existing tree without meaningful differentiation

PRs will be accepted if they:

- Ground every benchmark in a recognized standard, certification, or documented framework
- Include at least one quantitative metric per benchmark level
- Have 6–12 well-differentiated nodes
- Include relationships that accurately reflect the learning order in the domain
- Describe *observable* behavior, not internal mental states

---

## Questions?

Open a GitHub Issue with the label `contribution-question` and a maintainer will respond.
