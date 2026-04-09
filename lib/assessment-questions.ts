/**
 * Deep Assessment Questions
 *
 * 6 sections, 28 questions total. Mixes cognitive tasks (pattern recognition,
 * scenario judgment, estimation) with self-reflection (energy mapping, flow
 * states, discomfort tolerance).
 */

import type { AssessmentSection } from "@/types/assessment";

export const ASSESSMENT_SECTIONS: AssessmentSection[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // Section 1: Pattern Mind
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "pattern-mind",
    title: "Pattern Mind",
    subtitle: "Analytical · Strategic · Technical",
    intro: "Let\u2019s see how your brain naturally processes information. No tricks \u2014 just patterns.",
    questions: [
      {
        id: "pm-seq-1",
        type: "number-sequence",
        signalType: "cognitive",
        title: "What comes next in this sequence?",
        subtitle: "2, 6, 12, 20, \u2026",
        correctAnswer: 30,
        tolerance: 2,
        traitWeights: { analytical: 3, patience: 1 },
      },
      {
        id: "pm-seq-2",
        type: "number-sequence",
        signalType: "cognitive",
        title: "What comes next in this sequence?",
        subtitle: "1, 1, 2, 3, 5, 8, \u2026",
        correctAnswer: 13,
        tolerance: 0,
        traitWeights: { analytical: 3, strategic: 1 },
      },
      {
        id: "pm-odd-1",
        type: "odd-one-out",
        signalType: "cognitive",
        title: "Which word is most different from the others?",
        traitWeights: { analytical: 3, creative: 1 },
        options: [
          { id: "hammer", label: "Hammer", correct: false, interest: {}, aptitude: {} },
          { id: "screwdriver", label: "Screwdriver", correct: false, interest: {}, aptitude: {} },
          { id: "nail", label: "Nail", correct: true, interest: {}, aptitude: { analytical: 3, creative: 1 } },
          { id: "wrench", label: "Wrench", correct: false, interest: {}, aptitude: {} },
        ],
      },
      {
        id: "pm-odd-2",
        type: "odd-one-out",
        signalType: "cognitive",
        title: "Which word is most different from the others?",
        traitWeights: { analytical: 2, creative: 2 },
        options: [
          { id: "river", label: "River", correct: false, interest: {}, aptitude: {} },
          { id: "lake", label: "Lake", correct: false, interest: {}, aptitude: {} },
          { id: "ocean", label: "Ocean", correct: false, interest: {}, aptitude: {} },
          { id: "bridge", label: "Bridge", correct: true, interest: {}, aptitude: { analytical: 2, creative: 2 } },
        ],
      },
      {
        id: "pm-learn",
        type: "single-select",
        signalType: "self-reflection",
        title: "When you encounter a new system \u2014 an app, a game, a machine \u2014 how quickly do you typically figure it out?",
        traitWeights: { technical: 2, analytical: 1, patience: 1 },
        options: [
          { id: "immediately", label: "Almost immediately", interest: {}, aptitude: { technical: 3, analytical: 2 } },
          { id: "quickly", label: "Faster than most people", interest: {}, aptitude: { technical: 2, analytical: 1 } },
          { id: "average", label: "About average", interest: {}, aptitude: { technical: 1 } },
          { id: "slow", label: "I take my time", interest: {}, aptitude: { patience: 2 } },
          { id: "manual", label: "I prefer a guide or manual", interest: {}, aptitude: { patience: 2, analytical: 1 } },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Section 2: Social Radar
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "social-radar",
    title: "Social Radar",
    subtitle: "Social · Expressive · Strategic",
    intro: "How you read people and navigate groups says more about you than you might think.",
    questions: [
      {
        id: "sr-scenario-1",
        type: "scenario-judgment",
        signalType: "cognitive",
        title: "You\u2019re leading a group project and two members disagree on the approach. What do you do?",
        traitWeights: { social: 2, strategic: 2, expressive: 1 },
        options: [
          { id: "decide", label: "Make the call yourself to keep things moving", interest: {}, aptitude: { strategic: 3, competitive: 1 } },
          { id: "debate", label: "Let them work it out between themselves", interest: {}, aptitude: { patience: 2, social: 1 } },
          { id: "mediate", label: "Facilitate a compromise that works for both", interest: {}, aptitude: { social: 3, expressive: 2 } },
          { id: "present", label: "Have each present their case to the group", interest: {}, aptitude: { analytical: 2, social: 1, strategic: 1 } },
        ],
      },
      {
        id: "sr-scenario-2",
        type: "scenario-judgment",
        signalType: "cognitive",
        title: "A friend shares an idea you think won\u2019t work. How do you respond?",
        traitWeights: { social: 2, expressive: 1, analytical: 1 },
        options: [
          { id: "direct", label: "Be honest about the problems you see", interest: {}, aptitude: { analytical: 2, competitive: 1 } },
          { id: "questions", label: "Ask questions to help them see the gaps", interest: {}, aptitude: { social: 3, strategic: 1 } },
          { id: "encourage", label: "Encourage them and offer to help refine it", interest: {}, aptitude: { expressive: 2, social: 2 } },
          { id: "alternative", label: "Share your alternative approach", interest: {}, aptitude: { creative: 2, competitive: 1 } },
        ],
      },
      {
        id: "sr-scenario-3",
        type: "scenario-judgment",
        signalType: "cognitive",
        title: "You notice a teammate has been unusually quiet this week. What\u2019s your instinct?",
        traitWeights: { social: 3, patience: 1, wellness: 1 },
        options: [
          { id: "ask", label: "Ask them directly if everything\u2019s okay", interest: {}, aptitude: { social: 3, expressive: 1 } },
          { id: "space", label: "Give them space \u2014 they\u2019ll speak up when ready", interest: {}, aptitude: { patience: 2, wellness: 1 } },
          { id: "lead", label: "Flag it to the team lead", interest: {}, aptitude: { strategic: 2 } },
          { id: "nothing", label: "Carry on \u2014 probably nothing", interest: {}, aptitude: { competitive: 1 } },
        ],
      },
      {
        id: "sr-energy-1",
        type: "energy-mapping",
        signalType: "self-reflection",
        title: "After an hour of deep conversation with someone you just met, your energy is\u2026",
        traitWeights: { social: 3, expressive: 1 },
        options: [
          { id: "drained", label: "Drained", interest: {}, aptitude: { patience: 2 } },
          { id: "neutral", label: "Neutral", interest: {}, aptitude: { social: 1 } },
          { id: "energized", label: "Energized", interest: { social: 2 }, aptitude: { social: 3, expressive: 1 } },
        ],
      },
      {
        id: "sr-energy-2",
        type: "energy-mapping",
        signalType: "self-reflection",
        title: "After giving a presentation or explaining something to a group, your energy is\u2026",
        traitWeights: { expressive: 3, social: 1 },
        options: [
          { id: "drained", label: "Drained", interest: {}, aptitude: { patience: 2 } },
          { id: "neutral", label: "Neutral", interest: {}, aptitude: { expressive: 1 } },
          { id: "energized", label: "Energized", interest: { expressive: 2 }, aptitude: { expressive: 3, social: 1 } },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Section 3: Creative Instinct
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "creative-instinct",
    title: "Creative Instinct",
    subtitle: "Creative · Expressive · Patience",
    intro: "Creativity isn\u2019t just about art. Let\u2019s see where yours shows up.",
    questions: [
      {
        id: "ci-assoc-1",
        type: "rapid-association",
        signalType: "cognitive",
        title: "Which of these words is most different from the others?",
        subtitle: "Think about what each word represents, not just its surface meaning.",
        traitWeights: { creative: 2, analytical: 2 },
        options: [
          { id: "melody", label: "Melody", correct: false, interest: {}, aptitude: {} },
          { id: "rhythm", label: "Rhythm", correct: false, interest: {}, aptitude: {} },
          { id: "harmony", label: "Harmony", correct: false, interest: {}, aptitude: {} },
          { id: "volume", label: "Volume", correct: true, interest: {}, aptitude: { creative: 2, analytical: 2 } },
        ],
      },
      {
        id: "ci-assoc-2",
        type: "rapid-association",
        signalType: "cognitive",
        title: "Which pair of words is most closely related?",
        traitWeights: { creative: 3, analytical: 1 },
        options: [
          { id: "canvas-frame", label: "Canvas \u2014 Frame", correct: false, interest: {}, aptitude: { creative: 1 } },
          { id: "song-dance", label: "Song \u2014 Dance", correct: false, interest: {}, aptitude: { creative: 1 } },
          { id: "blueprint-building", label: "Blueprint \u2014 Building", correct: true, interest: {}, aptitude: { creative: 3, analytical: 1 } },
          { id: "story-character", label: "Story \u2014 Character", correct: false, interest: {}, aptitude: { creative: 1, expressive: 1 } },
        ],
      },
      {
        id: "ci-rank-1",
        type: "prioritization",
        signalType: "cognitive",
        title: "You have 3 free hours and unlimited resources. Rank these by appeal.",
        traitWeights: { creative: 3, expressive: 2, patience: 1 },
        options: [
          { id: "sketch", label: "Sketch or paint something", interest: { creative: 3, expressive: 2 }, aptitude: {} },
          { id: "write", label: "Write a short story", interest: { creative: 2, expressive: 3 }, aptitude: {} },
          { id: "redesign", label: "Rearrange or redesign a room", interest: { creative: 2, technical: 1 }, aptitude: {} },
          { id: "cook", label: "Cook an elaborate meal", interest: { creative: 2, naturalistic: 1, patience: 1 }, aptitude: {} },
        ],
      },
      {
        id: "ci-flow",
        type: "flow-state",
        signalType: "self-reflection",
        title: "When was the last time you completely lost track of time? What were you doing?",
        subtitle: "Pick all that apply",
        maxSelections: 4,
        traitWeights: {},
        options: [
          { id: "making", label: "Making or building something", interest: { creative: 2, technical: 1 }, aptitude: { creative: 2, patience: 1 } },
          { id: "solving", label: "Solving a problem or puzzle", interest: { analytical: 2 }, aptitude: { analytical: 2, strategic: 1 } },
          { id: "moving", label: "Moving my body (sport, dance, exercise)", interest: { physical: 2 }, aptitude: { physical: 2, competitive: 1 } },
          { id: "talking", label: "Deep conversation", interest: { social: 2 }, aptitude: { social: 2, expressive: 1 } },
          { id: "learning", label: "Reading or learning something new", interest: { analytical: 1, strategic: 1 }, aptitude: { patience: 2, analytical: 1 } },
          { id: "gaming", label: "Playing a game", interest: { competitive: 1, strategic: 1 }, aptitude: { strategic: 2, competitive: 1 } },
          { id: "organizing", label: "Organizing or planning", interest: { strategic: 2 }, aptitude: { strategic: 2, patience: 1 } },
          { id: "caring", label: "Caring for others or nature", interest: { social: 1, naturalistic: 1 }, aptitude: { social: 1, wellness: 1, naturalistic: 1 } },
        ],
      },
      {
        id: "ci-discomfort",
        type: "discomfort-tolerance",
        signalType: "self-reflection",
        title: "Which of these uncomfortable creative situations would you push through?",
        subtitle: "Pick all that apply",
        maxSelections: 4,
        traitWeights: { patience: 2, creative: 1, competitive: 1 },
        options: [
          { id: "start-over", label: "Starting over after hours of work", interest: {}, aptitude: { patience: 3, creative: 1 } },
          { id: "share-unfinished", label: "Sharing something unfinished with others", interest: {}, aptitude: { expressive: 2, social: 1 } },
          { id: "no-ideas", label: "Sitting with no ideas until something comes", interest: {}, aptitude: { patience: 3, creative: 2 } },
          { id: "harsh-feedback", label: "Receiving harsh feedback on your work", interest: {}, aptitude: { competitive: 2, patience: 1 } },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Section 4: Strategic Lens
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "strategic-lens",
    title: "Strategic Lens",
    subtitle: "Strategic · Analytical · Competitive",
    intro: "Strategy is about how you see the board \u2014 even when the board keeps changing.",
    questions: [
      {
        id: "sl-est-1",
        type: "estimation",
        signalType: "cognitive",
        title: "Without calculating precisely: roughly how many tennis balls fit in a school bus?",
        traitWeights: { analytical: 2, strategic: 2, patience: 1 },
        options: [
          { id: "a", label: "50\u2013200", correct: false, interest: {}, aptitude: {} },
          { id: "b", label: "200\u20132,000", correct: false, adjacent: true, interest: {}, aptitude: {} },
          { id: "c", label: "2,000\u201320,000", correct: false, adjacent: true, interest: {}, aptitude: {} },
          { id: "d", label: "20,000\u2013200,000", correct: true, interest: {}, aptitude: { analytical: 2, strategic: 2, patience: 1 } },
        ],
      },
      {
        id: "sl-est-2",
        type: "estimation",
        signalType: "cognitive",
        title: "If you read 20 pages a day, roughly how many 300-page books can you finish in a year?",
        traitWeights: { analytical: 2, patience: 2 },
        options: [
          { id: "a", label: "5\u201310", correct: false, interest: {}, aptitude: {} },
          { id: "b", label: "15\u201325", correct: true, interest: {}, aptitude: { analytical: 2, patience: 2 } },
          { id: "c", label: "25\u201350", correct: false, adjacent: true, interest: {}, aptitude: {} },
          { id: "d", label: "50+", correct: false, interest: {}, aptitude: {} },
        ],
      },
      {
        id: "sl-rank-1",
        type: "prioritization",
        signalType: "cognitive",
        title: "You\u2019re planning a 6-month learning project. Rank what matters most.",
        traitWeights: { strategic: 3, social: 1, patience: 1 },
        options: [
          { id: "milestones", label: "Clear milestones and deadlines", interest: {}, aptitude: { strategic: 3, patience: 1 } },
          { id: "mentor", label: "A great teacher or mentor", interest: {}, aptitude: { social: 2, strategic: 1 } },
          { id: "accountability", label: "An accountability partner", interest: {}, aptitude: { competitive: 2, social: 1 } },
          { id: "flexibility", label: "A flexible schedule", interest: {}, aptitude: { patience: 2, wellness: 1 } },
        ],
      },
      {
        id: "sl-compete",
        type: "multi-select",
        signalType: "self-reflection",
        title: "In which situations does competition make you perform better?",
        subtitle: "Pick all that apply",
        maxSelections: 5,
        traitWeights: { competitive: 3, social: 1 },
        options: [
          { id: "timed", label: "Timed challenges", interest: {}, aptitude: { competitive: 3, analytical: 1 } },
          { id: "h2h", label: "Head-to-head matchups", interest: {}, aptitude: { competitive: 3, physical: 1 } },
          { id: "leaderboard", label: "Public leaderboards", interest: {}, aptitude: { competitive: 2, social: 1 } },
          { id: "self", label: "Competing with my past self", interest: {}, aptitude: { patience: 2, competitive: 1 } },
          { id: "team", label: "Group competitions", interest: {}, aptitude: { social: 2, competitive: 1 } },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Section 5: Body & Environment
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "body-environment",
    title: "Body & Environment",
    subtitle: "Physical · Wellness · Naturalistic",
    intro: "Your relationship with your body, your environment, and your energy levels reveals more than you\u2019d think.",
    questions: [
      {
        id: "be-energy-1",
        type: "energy-mapping",
        signalType: "self-reflection",
        title: "After an hour of vigorous exercise, your energy is\u2026",
        traitWeights: { physical: 3, wellness: 1 },
        options: [
          { id: "drained", label: "Drained", interest: {}, aptitude: { patience: 1 } },
          { id: "neutral", label: "Neutral", interest: {}, aptitude: { physical: 1, wellness: 1 } },
          { id: "energized", label: "Energized", interest: { physical: 2 }, aptitude: { physical: 3, wellness: 2 } },
        ],
      },
      {
        id: "be-energy-2",
        type: "energy-mapping",
        signalType: "self-reflection",
        title: "After an hour in nature \u2014 hiking, gardening, or just sitting outside \u2014 your energy is\u2026",
        traitWeights: { naturalistic: 3, wellness: 1 },
        options: [
          { id: "drained", label: "Drained", interest: {}, aptitude: { patience: 1 } },
          { id: "neutral", label: "Neutral", interest: {}, aptitude: { naturalistic: 1 } },
          { id: "energized", label: "Energized", interest: { naturalistic: 2, wellness: 1 }, aptitude: { naturalistic: 3, wellness: 2 } },
        ],
      },
      {
        id: "be-rank-1",
        type: "prioritization",
        signalType: "cognitive",
        title: "Weekend morning. Rank these by how you\u2019d actually spend it.",
        traitWeights: { physical: 2, naturalistic: 1, wellness: 1, technical: 1 },
        options: [
          { id: "workout", label: "A long run or workout", interest: { physical: 3, competitive: 1 }, aptitude: {} },
          { id: "market", label: "Farmers market + cooking", interest: { naturalistic: 2, creative: 1 }, aptitude: {} },
          { id: "journal", label: "Journaling or meditation", interest: { wellness: 3, patience: 1 }, aptitude: {} },
          { id: "fix", label: "Fixing or building something around the house", interest: { technical: 2, patience: 1 }, aptitude: {} },
        ],
      },
      {
        id: "be-discomfort",
        type: "discomfort-tolerance",
        signalType: "self-reflection",
        title: "Which of these physically or mentally uncomfortable situations would you voluntarily push through?",
        subtitle: "Pick all that apply",
        maxSelections: 5,
        traitWeights: { physical: 1, competitive: 1, wellness: 1, patience: 1 },
        options: [
          { id: "cold", label: "Cold shower or ice bath", interest: {}, aptitude: { competitive: 2, wellness: 1 } },
          { id: "extra-set", label: "One more set when your muscles are burning", interest: {}, aptitude: { physical: 2, competitive: 2 } },
          { id: "fasting", label: "Fasting for a full day", interest: {}, aptitude: { patience: 3, wellness: 1 } },
          { id: "silence", label: "Sitting in total silence for 30 minutes", interest: {}, aptitude: { patience: 3, wellness: 2 } },
          { id: "early", label: "Waking at 5 AM for a week", interest: {}, aptitude: { competitive: 1, patience: 2, wellness: 1 } },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // Section 6: Putting It Together
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: "putting-together",
    title: "Putting It Together",
    subtitle: "Cross-cutting · Validation",
    intro: "Last stretch. These questions connect the dots across everything else.",
    questions: [
      {
        id: "pt-scenario",
        type: "scenario-judgment",
        signalType: "cognitive",
        title: "You\u2019re given $1,000 and one month off. What do you do?",
        traitWeights: { strategic: 1, creative: 1, physical: 1, social: 1 },
        options: [
          { id: "class", label: "Take an intensive class in something brand new", interest: { analytical: 2, technical: 1 }, aptitude: { analytical: 1, patience: 1 } },
          { id: "equipment", label: "Buy equipment for a physical skill and practice daily", interest: { physical: 2, competitive: 1 }, aptitude: { physical: 1, competitive: 1 } },
          { id: "coach", label: "Hire a coach or mentor in your field", interest: { social: 1, strategic: 1 }, aptitude: { social: 1, strategic: 2 } },
          { id: "travel", label: "Travel somewhere and immerse in a new culture", interest: { creative: 2, naturalistic: 1 }, aptitude: { creative: 1, social: 1 } },
        ],
      },
      {
        id: "pt-rank-skills",
        type: "prioritization",
        signalType: "cognitive",
        title: "If you could be instantly proficient in any of these, which would you choose? Rank your top 4.",
        rankCount: 4,
        traitWeights: {},
        options: [
          { id: "music", label: "Playing an instrument", interest: { creative: 3, expressive: 2 }, aptitude: {} },
          { id: "martial", label: "A martial art", interest: { physical: 3, competitive: 2 }, aptitude: {} },
          { id: "coding", label: "Programming", interest: { technical: 3, analytical: 2 }, aptitude: {} },
          { id: "speaking", label: "Public speaking", interest: { expressive: 3, social: 2 }, aptitude: {} },
          { id: "cooking", label: "Cooking at a professional level", interest: { creative: 2, patience: 2, naturalistic: 1 }, aptitude: {} },
          { id: "language", label: "A second language", interest: { social: 2, patience: 2, expressive: 1 }, aptitude: {} },
          { id: "chess", label: "Chess", interest: { strategic: 3, analytical: 2, competitive: 1 }, aptitude: {} },
          { id: "photo", label: "Photography", interest: { creative: 2, technical: 2, expressive: 1 }, aptitude: {} },
        ],
      },
      {
        id: "pt-identity",
        type: "single-select",
        signalType: "self-reflection",
        title: "Which description fits you best?",
        traitWeights: {},
        options: [
          { id: "builder", label: "I\u2019m a builder \u2014 I like making things that work", interest: {}, aptitude: { technical: 2, creative: 2, patience: 1 } },
          { id: "thinker", label: "I\u2019m a thinker \u2014 I like understanding how things work", interest: {}, aptitude: { analytical: 3, strategic: 1 } },
          { id: "connector", label: "I\u2019m a connector \u2014 I like bringing people together", interest: {}, aptitude: { social: 3, expressive: 1 } },
          { id: "mover", label: "I\u2019m a mover \u2014 I like being active and in motion", interest: {}, aptitude: { physical: 2, competitive: 2, wellness: 1 } },
        ],
      },
      {
        id: "pt-growth",
        type: "single-select",
        signalType: "self-reflection",
        title: "What\u2019s the hardest part of learning something new for you?",
        traitWeights: { patience: 2, strategic: 1 },
        options: [
          { id: "starting", label: "Starting when I know I\u2019ll be bad at it", interest: {}, aptitude: { patience: 2 } },
          { id: "consistency", label: "Staying consistent past the initial excitement", interest: {}, aptitude: { patience: 3 } },
          { id: "resources", label: "Finding the right resources or approach", interest: {}, aptitude: { strategic: 2, analytical: 1 } },
          { id: "time", label: "Making time for it alongside everything else", interest: {}, aptitude: { wellness: 1, strategic: 1 } },
        ],
      },
      {
        id: "pt-quick",
        type: "single-select",
        signalType: "self-reflection",
        title: "Quick \u2014 which skill sounds most appealing right now?",
        subtitle: "Don\u2019t overthink it.",
        traitWeights: {},
        options: [
          { id: "instrument", label: "Learn an instrument", interest: { creative: 3, expressive: 2, patience: 1 }, aptitude: {} },
          { id: "sport", label: "Get good at a sport", interest: { physical: 3, competitive: 2 }, aptitude: {} },
          { id: "code", label: "Build something with code", interest: { technical: 3, analytical: 2 }, aptitude: {} },
          { id: "speak", label: "Become a better communicator", interest: { social: 2, expressive: 2 }, aptitude: {} },
          { id: "think", label: "Master a complex strategy game", interest: { strategic: 3, analytical: 2, competitive: 1 }, aptitude: {} },
          { id: "wellness", label: "Develop a wellness practice", interest: { wellness: 3, patience: 2 }, aptitude: {} },
        ],
      },
    ],
  },
];
