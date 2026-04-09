/**
 * Creative Arts Try-It Modules
 *
 * Points users to beginner lessons and tutorials where they can
 * experience the skill firsthand before committing.
 */

import type { TryItModule } from "@/types/try-it";

export const CREATIVE_MODULES: TryItModule[] = [
  {
    id: "tryit-guitar-chords",
    nodePathId: "creative-arts/guitar/chords",
    treePathId: "creative-arts/guitar",
    title: "Try It: First Guitar Chords",
    description:
      "If you have access to a guitar (borrow one, visit a music shop, or use a friend's), try learning your first 2-3 chords. 15 minutes is enough to know if it clicks.",
    reflectionPrompts: [
      "Did pressing the strings feel natural or uncomfortable?",
      "Were you able to hear a clean sound, or mostly buzzing?",
      "Did you feel the urge to try another chord after the first one?",
    ],
    traitProfile: { creative: 5, expressive: 4, patience: 4 },
    resources: [
      {
        title: "Justin Guitar — Beginner Course (Free)",
        url: "https://www.justinguitar.com/categories/beginner-guitar-lessons-grade-1",
        description:
          "The internet's most popular free guitar course. Start with lesson 1 — just learn the D chord.",
        estimatedMinutes: 15,
        type: "course",
      },
      {
        title: "Fender Play — Free Trial",
        url: "https://www.fender.com/play",
        description:
          "Structured video lessons with a built-in tuner. The free trial gives you enough to try your first chords.",
        estimatedMinutes: 20,
        type: "lesson",
      },
    ],
  },
  {
    id: "tryit-cooking-mise",
    nodePathId: "creative-arts/cooking/mise-en-place",
    treePathId: "creative-arts/cooking",
    title: "Try It: Mise en Place",
    description:
      "Pick a simple recipe and prep every ingredient before you start cooking. The goal isn't the final dish — it's noticing how the preparation process feels.",
    reflectionPrompts: [
      "Did the process of measuring and organizing feel satisfying or tedious?",
      "Were you comfortable with a knife, or did it feel unfamiliar?",
      "Did you want to start experimenting beyond the recipe?",
    ],
    traitProfile: { creative: 4, patience: 3, naturalistic: 2 },
    resources: [
      {
        title: "Bon Appétit — Knife Skills 101 (YouTube)",
        url: "https://www.youtube.com/watch?v=20gwf7YttQM",
        description:
          "Learn basic knife cuts in 8 minutes. Try them with an onion and a carrot.",
        estimatedMinutes: 15,
        type: "video",
      },
      {
        title: "Serious Eats — How to Dice an Onion",
        url: "https://www.seriouseats.com/knife-skills-how-to-dice-an-onion",
        description:
          "Step-by-step guide with photos. Practice the technique 2-3 times.",
        estimatedMinutes: 10,
        type: "tutorial",
      },
      {
        title: "Pick a Recipe — Budget Bytes",
        url: "https://www.budgetbytes.com/category/recipes/quick/",
        description:
          "Choose a simple 30-minute recipe and focus on prepping all ingredients before turning on the stove.",
        estimatedMinutes: 30,
        type: "exercise",
      },
    ],
  },
];
