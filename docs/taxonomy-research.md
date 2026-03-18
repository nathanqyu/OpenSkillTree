# Market Research: Skill Taxonomy Landscape for KYZN Labs / OpenSkillTree

**Source:** Internal research
**Status:** Formatted & distilled for team use
**Relevant to:** OPE project

---

## Executive Summary

No universal cross-domain skill taxonomy with quantitative benchmarks exists today — and every startup that has attempted to build one has either narrowed its scope, pivoted to enterprise B2B, or died. The pieces are scattered across professional competency frameworks (O\*NET, ESCO), sports analytics systems (Strokes Gained, UTR, VDOT), gamified learning platforms (Duolingo, Habitica), and AI coaching unicorns (BetterUp, Degreed, Eightfold AI) — but nobody has unified them.

**The strategic conclusion:** The technology to build a universal skill platform finally exists — AI inference, sensor data, and LLMs can now assess skills at scale in ways that previous generations couldn't. But the execution path is narrow: start with one domain, go deep, then expand.

---

## 1. Existing Skill Taxonomies

### Professional Frameworks

| Framework | Scale | Strengths | Gaps |
|-----------|-------|-----------|------|
| **O\*NET** (US DOL) | 1,016 occupations, 35 skills, 52 abilities | Quantitative ratings (importance 1–5, level 1–7); open CC BY 4.0; REST API | Limited to occupational context |
| **ESCO** (EU) | 13,485 skills across 2,942 occupations, 28 languages | Semantic web (RDF/SKOS); multilingual | No proficiency levels — describes *what* but not *what good looks like* |
| **Lightcast** | 33,000+ skills from job posting data | Labor-market driven, largest taxonomy | Proprietary analytics API |
| **SFIA** | 102 ICT skills × 7 levels | 7-level behavioral proficiency model (Follow → Set Strategy); closest to "skill tree with levels" | Limited to tech roles |

### Open-Source Skill Tree Projects

| Project | Stars | Notes |
|---------|-------|-------|
| **roadmap.sh** (kamranahmedse) | ~300,000 | 6th most-starred on GitHub; visual skill paths for 50+ developer roles |
| **NSA SkillTree** | ~197 | Production-grade gamification: points, quizzes, React/Angular/Vue libs; Apache 2.0 |
| **MakerSkillTree** | ~2,400 | RPG-style hexagonal progression trees for maker skills; CC BY-NC-SA 4.0 |
| **WGU OSMT** | — | Rich Skill Descriptors for portable skill definitions |
| **CaSS** | — | Linked data standards for competency management (xAPI, CTDL-ASN) |

### Academic Models

- **COMP2 ontology** (Paquette et al., 2021): Competency = generic skill + knowledge + performance level + context — most comprehensive formal model
- **McKay et al. (2022) Participant Classification Framework**: 6 tiers from Sedentary to World Class across all sports using training volume and performance vs. world records

---

## 2. Sports Benchmarking: Deeply Instructive Models

Sports have the most elegant skill decomposition methodologies — fragmented by domain but full of applicable patterns.

### Key Rating & Measurement Systems

| System | Domain | Method | Scale |
|--------|--------|--------|-------|
| **Strokes Gained** (Columbia/PGA) | Golf | Decomposes performance into 4 sub-skills vs. peer benchmarks | PGA Tour → amateur levels via Data Golf API |
| **UTR** (Universal Tennis Rating) | Tennis | Modified Elo from games won + opponent strength | 1.00–16.50; 800,000+ rated players; Engage API |
| **VDOT** (Jack Daniels) | Running | Race performance → pseudo-VO₂max → 5 training zones + cross-distance predictions | ~30–85+ |
| **FINA Points** | Swimming | P = 1000 × (B/T)³ — compares any swim to world record | Cross-event comparable |
| **CrossFit** | Fitness | Standardized benchmark workouts with normative percentile data | 133,857+ profiles |

### Key Lesson: Nike SPARQ
SPARQ was a "SAT for athletes" — standardized testing across football, soccer, baseball, basketball producing a single composite score. At peak: 750 certified trainers, 200,000+ ratings. **Validated the concept, but physical testing events don't scale.** Killed by Nike prioritizing product sales after 2009 acquisition. Digital/sensor-based measurement is required.

### Open Sports Datasets
- `josedv82/public_sport_science_datasets`: NFL Combine (13,000+ obs since 1987), NBA tracking, MLB sprint, StatsBomb soccer, NHL play-by-play
- `nba_api` Python package: player tracking, shot quality, defensive matchups, speed/distance via NBA.com
- Army AFT scoring tables: 0–100 scaled scores with age/gender normalization, publicly available
- World Athletics age-graded tables: convert any result to % of age/sex world record (60% = local, 80% = national, 90% = world class)

---

## 3. Competitive Landscape & Strategic Positioning

### The "Open Taxonomy, Proprietary Intelligence" Model

> **Open the taxonomy; keep the AI proprietary.**

This follows Joel Spolsky's "commoditize your complement" principle. Precedents:

| Company | Open | Proprietary | Outcome |
|---------|------|-------------|---------|
| **Lightcast** | 33,000+ skills taxonomy | Analytics + enterprise integration | "Universal standard" in labor market intelligence |
| **Hugging Face** | Model hub + Transformers | Enterprise hosting, inference, security | ~$70M ARR, $4.5B valuation |
| **Mapbox** | OpenStreetMap data | Rendering, navigation, developer tools | $1B+ company |
| **Schema.org** | Structured data vocabulary | — | Google captured value at consumption layer |

**Moat hierarchy (strongest → weakest):**
1. AI models + proprietary assessment data (genuine data network effects)
2. User experience and gamification layer (switching costs compound)
3. Community and network effects
4. Brand and trust (open-sourcing *strengthens* this)
5. The taxonomy itself (useful but not defensible alone)

### Analogous Companies: What Happened

**Enterprise pivots (survived/thrived):**
- **Degreed** — founded 2012 as consumer "jailbreak the degree"; pivoted to enterprise LXM; reached profitability Jan 2025; 1/3 of Fortune 50 as customers ($597M raised, $1.4B valuation)
- **Eightfold AI** — AI skills ontology for enterprise talent intelligence ($410M raised, $2.1B valuation)
- **BetterUp** — human + AI coaching for enterprise; acquired 5 companies ($628M raised, $4.7B valuation)

**Consumer attempts (failed/narrowed):**
- **Fitocracy** — RPG gamification for fitness; died from gamification decay + failed monetization + no wearable integration
- **Habitica** — 5M+ installs but struggling; removed social features 2023 due to moderation costs
- **SuperBetter** — survived by narrowing to youth mental health with clinical validation
- **Pymetrics** — game-based skill assessment ($60.7M raised); acquired by Harver 2022

**Consumer successes (by going narrow/deep):**
- **Duolingo** — 100M+ MAU; succeeded by going *deeply narrow* in language learning with continuously evolving game mechanics
- **Khan Academy** — mastery system works because math/science is sequential and objectively testable
- **Salesforce Trailhead** — badges translate directly to hiring outcomes

### Key Failure Patterns
1. **Breadth vs. depth**: Platforms that measure everything measure nothing well. Start narrow, expand deliberately.
2. **Consumer vs. enterprise**: Enterprise pays reliably ($8.16B market in 2025, projected $30.77B by 2034). Consumers mostly don't.
3. **Gamification decay**: Points and badges without continuous evolution and real-world stakes lose engagement within months.
4. **Self-reported skill levels are unreliable** (confirmed by USAID research). AI inference from behavioral data is the scalable approach.
5. **Scientific validation matters**: SuperBetter, Pymetrics, and Knack all gained institutional adoption through peer-reviewed research.

---

## 4. Strategic Recommendations for KYZN Labs

1. **Start with one domain, go deep, then expand.** Strong candidate domains: climbing (Yosemite Decimal System grading), running (VDOT), tennis (UTR). Each already has a community, a grading system, and engaged users.

2. **Build the open taxonomy as a strategic asset, not the product.** Use O\*NET + ESCO as professional skill backbones. Adopt SFIA's 7-level proficiency model. Layer in sport-specific extensions modeled on McKay's tiered classification. Open-source all of it under CC BY 4.0.

3. **Plan for enterprise revenue from day one.** Consumer gamification layer = distribution engine. Enterprise contracts (corporate wellness, sports academies, educational institutions) = revenue engine.

4. **Leverage existing open data before building proprietary data.** NFL Combine, NBA tracking, O\*NET, ESCO, SFIA, roadmap.sh — these are free and immediately usable for bootstrapping the taxonomy.

---

## Appendix: Key Resources

| Resource | Type | Access | Why It Matters |
|----------|------|--------|----------------|
| O\*NET (onetcenter.org) | Professional skill taxonomy | Open CC BY 4.0, REST API | 1,016 occupations with quantitative skill ratings |
| ESCO (esco.ec.europa.eu) | European skill taxonomy | Open EUPL 1.2, REST API | 13,485 skills in 28 languages, semantic web |
| Lightcast Open Skills | Labor market skills | Open taxonomy, commercial API | 33,000+ skills from job posting data |
| SFIA (sfia-online.org) | ICT competency framework | Free, JSON/RDF | 7-level proficiency model with behavioral descriptors |
| josedv82/public_sport_science_datasets | Sports data | Open | NFL Combine, NBA tracking, StatsBomb soccer |
| roadmap.sh (GitHub) | Developer skill paths | Open source | Most popular skill-tree project on GitHub (~300K stars) |
| NationalSecurityAgency/skills-service | Gamification platform | Apache 2.0 | Production-grade skill tree engine with client libs |
| sjpiper145/MakerSkillTree | Maker skill trees | CC BY-NC-SA 4.0 | RPG-style visual progression, 15+ craft domains |
| wgu-opensource/osmt | Skill definition tool | Open source | Rich Skill Descriptors for portable skill definitions |
| cassproject/CASS | Competency management | Open source | Standards-compliant (xAPI, CTDL-ASN) |
| nba_api (Python) | NBA stats wrapper | Free, semi-public | Player tracking, shot charts, combine data |
| StatsBomb open-data (GitHub) | Soccer event data | Free | Detailed match event data in JSON |
| McKay et al. (2022) | Athlete classification paper | Published | 6-tier framework for all sports with quantitative thresholds |
| COMP2 ontology (Paquette, 2021) | Competency modeling paper | Published | Formal model: Skill + Knowledge + Performance Level + Context |
