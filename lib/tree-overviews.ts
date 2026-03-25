/**
 * Overview content for each skill tree — notable practitioners,
 * what beginners vs experts look like, and what you'll learn.
 *
 * This is static display content, not stored in the database.
 * Keyed by tree pathId (e.g., "sports/tennis").
 */

export interface PractitionerExample {
  name: string;
  level: "beginner" | "expert";
  description: string;
}

export interface TreeOverview {
  /** One-line hook that makes someone want to explore the tree */
  hook: string;
  /** What a complete beginner looks like */
  beginnerProfile: string;
  /** What mastery looks like */
  expertProfile: string;
  /** Notable practitioners / role models */
  examples: PractitionerExample[];
  /** What you'll learn — 4-6 bullet points */
  whatYouWillLearn: string[];
  /** Estimated time to reach intermediate level */
  timeToIntermediate: string;
}

export const TREE_OVERVIEWS: Record<string, TreeOverview> = {
  "sports/tennis": {
    hook: "From first rally to competitive tournament play",
    beginnerProfile:
      "A beginner can rally a few balls over the net, is learning the basic grips, and is focused on simply making contact with the ball consistently.",
    expertProfile:
      "An expert commands every shot in the book — precise serves, punishing groundstrokes, and tactical mastery that controls the pace and geometry of every point.",
    examples: [
      {
        name: "Roger Federer",
        level: "expert",
        description:
          "Widely regarded as one of the greatest tennis players of all time. Known for an effortless style, sublime one-handed backhand, and 20 Grand Slam titles.",
      },
      {
        name: "Serena Williams",
        level: "expert",
        description:
          "Dominant power and athleticism with 23 Grand Slam singles titles. Transformed women's tennis with her serve and aggressive baseline play.",
      },
      {
        name: "A club player at NTRP 3.0",
        level: "beginner",
        description:
          "Can rally from the baseline with moderate consistency, has a developing serve, and is learning to approach the net. Plays recreational doubles on weekends.",
      },
    ],
    whatYouWillLearn: [
      "Proper grip technique and footwork fundamentals",
      "Forehand and backhand groundstrokes with directional control",
      "Serve mechanics from basic to spin serves",
      "Net play, volleys, and overhead smash",
      "Match strategy and mental composure under pressure",
    ],
    timeToIntermediate: "6-12 months with regular practice (2-3 times per week)",
  },

  "sports/pickleball": {
    hook: "The fastest-growing sport in America — from first paddle to tournament play",
    beginnerProfile:
      "A beginner can serve the ball in play, understands the basic rules (two-bounce rule, kitchen/NVZ), and is learning to dink at the net.",
    expertProfile:
      "An expert commands soft game and power game equally — constructing points with patient dinking, devastating third-shot drops, and explosive put-aways.",
    examples: [
      {
        name: "Ben Johns",
        level: "expert",
        description:
          "The #1 ranked pickleball player in the world. Known for his exceptional court awareness, soft hands at the kitchen, and ability to speed up at the perfect moment.",
      },
      {
        name: "Anna Leigh Waters",
        level: "expert",
        description:
          "The youngest #1 ranked player in pickleball history. Combines power, athleticism, and a mature soft game well beyond her years.",
      },
      {
        name: "A DUPR 3.0 recreational player",
        level: "beginner",
        description:
          "Enjoys the social aspect of the game, can sustain rallies with similar-level players, and is working on developing a reliable third-shot drop.",
      },
    ],
    whatYouWillLearn: [
      "Paddle grip, ready position, and court rules",
      "Serve and return of serve with placement",
      "The soft game: dinking and third-shot drops",
      "Power shots, drives, and overhead smashes",
      "Kitchen (NVZ) play including Erne shots and ATPs",
      "Doubles strategy, stacking, and communication",
    ],
    timeToIntermediate: "3-6 months with regular play (3+ times per week)",
  },

  "sports/strength-training": {
    hook: "Build strength systematically — from your first squat to competitive lifting",
    beginnerProfile:
      "A beginner is learning the basic movement patterns (squat, hinge, push, pull) with bodyweight or light loads, focusing on form over weight.",
    expertProfile:
      "An expert lifts at competitive standards (Wilks 400+), programs their own periodized training, and can coach others with deep biomechanical knowledge.",
    examples: [
      {
        name: "Mark Rippetoe",
        level: "expert",
        description:
          "Author of Starting Strength, the most widely-used novice barbell program. Popularized linear progression and the big four lifts as the foundation of strength.",
      },
      {
        name: "Stefi Cohen",
        level: "expert",
        description:
          "Doctor of Physical Therapy and 25x world-record-holding powerlifter. Deadlifted 4.4x her bodyweight — one of the strongest pound-for-pound lifters in history.",
      },
      {
        name: "A 3-month gym-goer",
        level: "beginner",
        description:
          "Following a linear progression program like Starting Strength or StrongLifts 5x5. Adding weight to the bar every session. Squat around 0.75x bodyweight.",
      },
    ],
    whatYouWillLearn: [
      "Fundamental movement patterns and gym orientation",
      "The four main barbell lifts: squat, bench, deadlift, overhead press",
      "Core stability and bracing technique",
      "Programming and periodization for continuous progress",
      "Nutrition fundamentals for strength development",
      "Competition preparation and peaking strategies",
    ],
    timeToIntermediate: "6-12 months of consistent training (3-4 days per week)",
  },

  "creative-arts/guitar": {
    hook: "From your first chord to performing on stage",
    beginnerProfile:
      "A beginner can play a handful of open chords, strum simple patterns, and is learning to transition between chords smoothly.",
    expertProfile:
      "An expert plays fluently across styles, improvises confidently, and performs with expression that moves an audience.",
    examples: [
      {
        name: "Jimi Hendrix",
        level: "expert",
        description:
          "Revolutionized electric guitar with innovative techniques, feedback, and a raw, expressive style that redefined what the instrument could do.",
      },
      {
        name: "Tommy Emmanuel",
        level: "expert",
        description:
          "Master fingerstyle guitarist who plays melody, bass, rhythm, and percussion simultaneously. Certified Guitar Player (CGP) — one of only five ever awarded by Chet Atkins.",
      },
      {
        name: "A 6-month student on JustinGuitar",
        level: "beginner",
        description:
          "Knows 8-10 open chords, can play simple songs like Knockin' on Heaven's Door, and is starting to learn barre chords. Practices 30 minutes daily.",
      },
    ],
    whatYouWillLearn: [
      "How to hold the guitar, tune, and read chord diagrams",
      "Open chords, barre chords, and strumming patterns",
      "Scales, pentatonic patterns, and fretboard navigation",
      "Lead techniques: bending, vibrato, hammer-ons, pull-offs",
      "Music theory applied to guitar: keys, intervals, chord progressions",
      "Performance skills and building a repertoire",
    ],
    timeToIntermediate: "6-12 months with daily practice (30-60 minutes)",
  },

  "creative-arts/photography": {
    hook: "From auto mode to intentional image-making",
    beginnerProfile:
      "A beginner shoots in Auto mode, is learning how to hold the camera steady, and takes photos that are technically acceptable but lack intention.",
    expertProfile:
      "An expert controls every aspect of the image — exposure, composition, light, color — and produces work that tells stories and evokes emotion.",
    examples: [
      {
        name: "Annie Leibovitz",
        level: "expert",
        description:
          "One of the most celebrated portrait photographers alive. Her images for Rolling Stone and Vanity Fair defined an era. Known for dramatic lighting and intimate, revealing compositions.",
      },
      {
        name: "Ansel Adams",
        level: "expert",
        description:
          "Master landscape photographer whose black-and-white images of the American West are iconic. Developed the Zone System for precise exposure control.",
      },
      {
        name: "A hobbyist with a mirrorless camera",
        level: "beginner",
        description:
          "Shoots in Aperture Priority mode, understands the exposure triangle conceptually, and is learning composition rules like the rule of thirds.",
      },
    ],
    whatYouWillLearn: [
      "Camera operation from Auto to full Manual mode",
      "The exposure triangle: aperture, shutter speed, ISO",
      "Composition fundamentals and visual storytelling",
      "Natural light reading and off-camera lighting",
      "RAW processing and post-production workflow",
      "Genre specialization: portraits, landscapes, street, product",
    ],
    timeToIntermediate: "3-6 months with regular shooting (weekly photo walks)",
  },

  "creative-arts/cooking": {
    hook: "From following recipes to creating your own dishes",
    beginnerProfile:
      "A beginner can follow a recipe step by step, is learning basic knife skills, and understands that food safety (temperature, cross-contamination) matters.",
    expertProfile:
      "An expert cooks instinctively — tasting, adjusting, and creating dishes without recipes. Commands classical techniques, manages complex multi-course meals, and designs menus.",
    examples: [
      {
        name: "Julia Child",
        level: "expert",
        description:
          "Brought French cooking to American home cooks through her book Mastering the Art of French Cooking and TV show The French Chef. Made classical technique accessible.",
      },
      {
        name: "Kenji Lopez-Alt",
        level: "expert",
        description:
          "Author of The Food Lab, known for applying scientific rigor to everyday cooking. His evidence-based approach to technique has influenced a generation of home cooks.",
      },
      {
        name: "A home cook in their first year",
        level: "beginner",
        description:
          "Can make scrambled eggs, pasta, and a basic stir-fry. Learning to dice an onion evenly and control heat. Follows recipes but is starting to understand why steps matter.",
      },
    ],
    whatYouWillLearn: [
      "Kitchen setup, mise en place, and food safety",
      "Knife skills: dicing, julienne, chiffonade",
      "Heat and cooking methods: saute, roast, braise, poach",
      "Flavor building: salt, acid, fat, heat, aromatics",
      "Stock, soup, and sauce making (the five mother sauces)",
      "Baking fundamentals, menu planning, and world cuisines",
    ],
    timeToIntermediate: "6-12 months of cooking regularly (3-4 times per week)",
  },

  "creative-arts/drawing-illustration": {
    hook: "From stick figures to confident, expressive drawing",
    beginnerProfile:
      "A beginner is learning to control their pencil, drawing from observation, and working on basic shapes, proportion, and line quality.",
    expertProfile:
      "An expert draws with confident, intentional marks — capturing form, light, and emotion. Creates original compositions and has developed a personal style.",
    examples: [
      {
        name: "Kim Jung Gi",
        level: "expert",
        description:
          "Legendary Korean artist known for drawing massive, complex scenes from imagination with no preliminary sketches. His spatial memory and perspective mastery were unmatched.",
      },
      {
        name: "Loish (Lois van Baarle)",
        level: "expert",
        description:
          "Digital artist and illustrator whose vibrant, expressive character art has influenced a generation. Known for dynamic poses and rich color palettes.",
      },
      {
        name: "A Drawabox student on Lesson 2",
        level: "beginner",
        description:
          "Has completed the 250 Box Challenge and is working on contour lines and texture. Can draw from the shoulder and produce confident, ghosted lines.",
      },
    ],
    whatYouWillLearn: [
      "Line quality and mark making from the shoulder",
      "Proportion, measurement, and structural drawing",
      "Form, volume, and 3D construction",
      "Light, shadow, and value rendering",
      "Perspective drawing (1-point, 2-point, 3-point)",
      "Figure drawing, color theory, and portfolio development",
    ],
    timeToIntermediate: "12-18 months with regular practice (1 hour daily)",
  },

  "science/chess": {
    hook: "From learning the pieces to thinking several moves ahead",
    beginnerProfile:
      "A beginner knows how the pieces move, understands check and checkmate, and is learning to avoid hanging pieces and simple tactical mistakes.",
    expertProfile:
      "An expert sees patterns instantly, calculates 5-10 moves deep, and understands positional concepts that govern the flow of the game at the highest level.",
    examples: [
      {
        name: "Magnus Carlsen",
        level: "expert",
        description:
          "World Chess Champion from 2013-2023 and the highest-rated player in history (2882). Known for squeezing wins from seemingly equal positions through relentless precision.",
      },
      {
        name: "Judit Polgar",
        level: "expert",
        description:
          "The strongest female chess player in history, peaking at #8 in the world. Defeated 11 world champions, including Kasparov, with her aggressive, tactical style.",
      },
      {
        name: "A Chess.com 800-rated player",
        level: "beginner",
        description:
          "Knows the rules and basic tactics (forks, pins). Plays mostly 10-minute games online. Blunders pieces occasionally but is improving through puzzle training.",
      },
    ],
    whatYouWillLearn: [
      "Piece movement, special rules, and algebraic notation",
      "Tactical patterns: forks, pins, skewers, discovered attacks",
      "Opening principles and 2-3 solid opening systems",
      "Endgame technique: king and pawn, rook endgames",
      "Positional play: pawn structure, piece activity, weak squares",
      "Calculation, visualization, and strategic planning",
    ],
    timeToIntermediate: "6-12 months with regular study and play (30 min daily)",
  },

  "technology/python": {
    hook: "From your first print statement to production-grade software",
    beginnerProfile:
      "A beginner has installed Python, can write simple scripts with variables and loops, and is learning to think in terms of functions and data structures.",
    expertProfile:
      "An expert designs scalable systems, writes idiomatic code that others love reading, and mentors teams on architecture, testing, and performance.",
    examples: [
      {
        name: "Guido van Rossum",
        level: "expert",
        description:
          "Creator of Python and its Benevolent Dictator For Life (BDFL) for 30 years. Designed the language's philosophy of readability and simplicity that makes it accessible to millions.",
      },
      {
        name: "Wes McKinney",
        level: "expert",
        description:
          "Creator of pandas, the foundational data analysis library in Python. His work made Python the default language for data science and analytics.",
      },
      {
        name: "A CS50P student in week 4",
        level: "beginner",
        description:
          "Can write functions with parameters and return values, handles basic exceptions, and is starting to work with file I/O. Has built a simple calculator and a text-based game.",
      },
    ],
    whatYouWillLearn: [
      "Python setup, syntax, variables, and data types",
      "Control flow, functions, and error handling",
      "File I/O and the standard library",
      "Object-oriented programming with classes",
      "Testing, packaging, and code quality",
      "APIs, data analysis, async programming, and performance",
    ],
    timeToIntermediate: "3-6 months with daily practice (1 hour daily)",
  },

  "business/product-management": {
    hook: "From your first user story to shaping product strategy",
    beginnerProfile:
      "A beginner (APM) can write clear problem statements and user stories, runs basic sprint ceremonies, and is learning to use data to inform decisions.",
    expertProfile:
      "An expert (CPO/VP Product) defines product strategy at the organizational level, builds high-performing product teams, and drives business outcomes through product vision.",
    examples: [
      {
        name: "Marty Cagan",
        level: "expert",
        description:
          "Author of Inspired and Empowered. Former VP Product at eBay and Netscape. His SVPG frameworks define how top product teams discover and deliver products.",
      },
      {
        name: "Shreyas Doshi",
        level: "expert",
        description:
          "Former PM leader at Stripe, Twitter, Google, and Yahoo. Known for frameworks like LNO (Leverage, Neutral, Overhead) that help PMs prioritize ruthlessly.",
      },
      {
        name: "A first-year Associate PM",
        level: "beginner",
        description:
          "Writes specs and user stories, participates in sprint planning, and is learning to conduct user interviews. Ships features under the guidance of a senior PM.",
      },
    ],
    whatYouWillLearn: [
      "Problem definition and user story writing",
      "Metrics, analytics, and data-driven decisions",
      "User research and product discovery",
      "Prioritization frameworks (RICE, ICE) and roadmapping",
      "Stakeholder management and cross-functional leadership",
      "Product strategy and go-to-market execution",
    ],
    timeToIntermediate: "2-3 years of full-time PM experience",
  },

  "business/linkedin-content-creation": {
    hook: "From zero followers to a recognized voice in your industry",
    beginnerProfile:
      "A beginner has optimized their profile, defined 2-3 content pillars, and is posting consistently while building an engagement habit through commenting.",
    expertProfile:
      "An expert has a distinctive voice recognized by their industry, commands a large engaged audience, and uses content as a strategic lever for business growth.",
    examples: [
      {
        name: "Justin Welsh",
        level: "expert",
        description:
          "Built a $5M+ solo business entirely through LinkedIn content. His LinkedIn Operating System course has trained thousands of creators on systematic content growth.",
      },
      {
        name: "Lara Acosta",
        level: "expert",
        description:
          "Grew from 0 to 100K+ followers in under a year through a distinctive, personality-driven content style. Known for vulnerability-based hooks and storytelling.",
      },
      {
        name: "A professional starting their content journey",
        level: "beginner",
        description:
          "Has an All-Star profile, posts 2-3 times per week, and comments on 5+ posts daily. Has 200 followers and is learning what resonates with their audience.",
      },
    ],
    whatYouWillLearn: [
      "Personal brand strategy and content pillar definition",
      "Profile optimization for discoverability",
      "Hook writing and copywriting techniques",
      "Engagement strategy and community building",
      "Analytics, optimization, and content distribution",
      "Newsletter creation and long-form content",
    ],
    timeToIntermediate: "6-12 months of consistent posting (3-5 posts per week)",
  },
};
