# Seed Skill Trees

First-pass example skill trees for OpenSkillTree. These YAML files serve as:

1. **Schema validation** — prove the data model can express real skill progressions
2. **Contribution templates** — show new contributors what a well-structured skill tree looks like
3. **Domain coverage examples** — cover athletics, professional skills, and content/creative

## Available Trees

| File | Domain | Nodes | Description |
|------|--------|-------|-------------|
| `sports/pickleball.yaml` | Sports | 10 | Full skill map from footwork fundamentals to advanced strategy |
| `sports/tennis.yaml` | Sports | 10 | Tennis skills from footwork and groundstrokes to strategy and mental game |
| `business/product-management.yaml` | Business | 11 | PM skills from user research to product strategy |
| `business/linkedin-content-creation.yaml` | Business | 10 | Creator skills from profile optimization to distribution |
| `creative-arts/photography.yaml` | Creative Arts | 11 | Photography from exposure triangle to off-camera lighting |
| `technology/python.yaml` | Technology | 12 | Python from syntax fundamentals to async, performance, and data analysis |

## Schema

Each tree file follows the semantic YAML format defined in `docs/roadmap-sh-architecture-analysis.md`:

```yaml
tree:          # SkillTree metadata
  id:          # hierarchical path ID (e.g., "sports/pickleball")
  title:       # human-readable name
  description: # what this tree covers
  domain:      # top-level category ("Sports", "Business", etc.)

nodes:         # array of SkillNode definitions
  - id:        # hierarchical path ID (e.g., "sports/pickleball/serve")
    title:     # skill name
    description:
    benchmarks:     # ordered beginner → expert
      - level:      # beginner | intermediate | advanced | expert
        criteria:   # qualitative description of what this level looks like
        metrics:    # quantitative measurements where available
    tags: []        # searchable labels

relationships:      # typed, directed edges between nodes
  - source:         # source node ID
    target:         # target node ID
    type:           # requires | enables | component-of | complementary | variant-of
    note:           # human-readable explanation of why this relationship exists
```

## Benchmark Approach

Benchmarks follow the OST principle: **every level has a number**. Where quantitative thresholds exist (pickleball DUPR ratings, LinkedIn engagement rates, PM delivery metrics), they are included as `metrics` arrays. Where the domain is inherently qualitative, criteria describe observable outcomes and behaviors.

Benchmark sources:
- **Pickleball**: DUPR rating system (2.0–8.0), coaching community standards
- **Tennis**: USTA NTRP (1.0–7.0), ITF Player Development Framework
- **Product Management**: Reforge PM leveling framework, industry standard PM career ladders
- **LinkedIn Content Creation**: LinkedIn Creator analytics benchmarks, content marketing industry data
- **Photography**: NYIP curriculum levels, PSA merit system, 500px Pulse ratings
- **Python**: Python Institute Certification Ladder (PCEP/PCAP/PCPP), industry engineering standards

## Relationship Types

| Type | Meaning | Example |
|------|---------|---------|
| `requires` | Prerequisite — must be developed first | Third Shot Drop requires Serve |
| `enables` | Opens up the next skill | Drives enables Overhead Smash |
| `component-of` | Sub-skill composition | Doubles Communication is component-of Strategy |
| `complementary` | Cross-skill transfer benefit | Return of Serve is complementary to Third Shot Drop |

## Next Steps

- [ ] Convert YAML → JSON against the formal JSON Schema (once schema is published)
- [ ] Load seed data into the Next.js app database (see `db/schema.sql`)
- [ ] Validate schema expressiveness with at least 1 domain expert per tree
- [ ] Add 5+ more domains to hit PRODUCT.md success metric of 5 published trees
