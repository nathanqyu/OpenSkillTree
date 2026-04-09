/**
 * Sports Try-It Modules
 *
 * Points users to real-world lessons, drills, and classes where they can
 * try the skill and see how it feels.
 */

import type { TryItModule } from "@/types/try-it";

export const SPORTS_MODULES: TryItModule[] = [
  {
    id: "tryit-tennis-footwork",
    nodePathId: "sports/tennis/footwork",
    treePathId: "sports/tennis",
    title: "Try It: Tennis Footwork",
    description:
      "Get on a court (or a flat surface) and try basic tennis movement patterns. Most local clubs and parks offer intro sessions — or grab a friend and a couple of rackets.",
    reflectionPrompts: [
      "Did the movement feel coordinated or awkward?",
      "Were you able to stay light on your feet, or did it feel heavy?",
      "Did you want to keep going or were you ready to stop?",
    ],
    traitProfile: { physical: 5, competitive: 3, patience: 2 },
    resources: [
      {
        title: "Essential Tennis — Footwork Fundamentals (YouTube)",
        url: "https://www.youtube.com/watch?v=bC5jH2B4MKQ",
        description:
          "Watch this 10-minute breakdown of basic tennis footwork, then try the split step and side shuffle on any flat surface.",
        estimatedMinutes: 20,
        type: "video",
      },
      {
        title: "Find a Local Tennis Lesson",
        url: "https://www.usta.com/en/home/play/find-a-court.html",
        description:
          "The USTA court finder helps you locate courts and programs near you. Many offer free first lessons.",
        estimatedMinutes: 60,
        type: "class",
      },
    ],
  },
  {
    id: "tryit-strength-movement",
    nodePathId: "sports/strength-training/movement-fundamentals",
    treePathId: "sports/strength-training",
    title: "Try It: Bodyweight Basics",
    description:
      "Try a 15-minute bodyweight workout. No equipment needed — just enough space to move. Focus on how the movements feel, not how many reps you do.",
    reflectionPrompts: [
      "Did your body feel coordinated during the movements?",
      "Were you sore afterward, or did it feel manageable?",
      "Is this the kind of challenge you'd want to repeat?",
    ],
    traitProfile: { physical: 5, patience: 4, wellness: 3 },
    resources: [
      {
        title: "Hybrid Calisthenics — Start Here (YouTube)",
        url: "https://www.youtube.com/watch?v=sMkMr2455mk",
        description:
          "Hampton's gentle, encouraging intro to bodyweight training. Follow along with the beginner routine.",
        estimatedMinutes: 15,
        type: "video",
      },
      {
        title: "r/bodyweightfitness Recommended Routine",
        url: "https://www.reddit.com/r/bodyweightfitness/wiki/kb/recommended_routine/",
        description:
          "The most popular community-built bodyweight program. Try just the warm-up and first pair of exercises.",
        estimatedMinutes: 20,
        type: "exercise",
      },
    ],
  },
];
