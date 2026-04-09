/**
 * Python Try-It Modules
 *
 * Each module points to curated external resources where users can actually
 * try the skill, then captures feedback to refine their discovery profile.
 * The platform doesn't build domain-specific tooling — it connects users
 * to the best existing resources and learns from their experience.
 */

import type { TryItModule } from "@/types/try-it";

export const PYTHON_MODULES: TryItModule[] = [
  {
    id: "tryit-python-syntax",
    nodePathId: "technology/python/syntax-data-types",
    treePathId: "technology/python",
    title: "Try It: Python Basics",
    description:
      "Spend 15–30 minutes with an interactive Python tutorial. You'll write variables, work with lists, and see how Python handles data — no setup required.",
    reflectionPrompts: [
      "Did the logic feel intuitive, or did you have to fight the syntax?",
      "Were you curious to try things beyond what the tutorial asked?",
      "Could you imagine writing code like this regularly?",
    ],
    traitProfile: { technical: 3, analytical: 2, patience: 1 },
    resources: [
      {
        title: "CS50P — Lecture 0: Functions (Harvard)",
        url: "https://cs50.harvard.edu/python/2022/weeks/0/",
        description:
          "David Malan's famous intro lecture. Watch the first 30 minutes and try the examples in the browser.",
        estimatedMinutes: 30,
        type: "course",
      },
      {
        title: "Python Tutorial — W3Schools Interactive",
        url: "https://www.w3schools.com/python/python_intro.asp",
        description:
          "Quick, interactive exercises you can run in the browser. Work through Variables, Data Types, and Lists.",
        estimatedMinutes: 20,
        type: "tutorial",
      },
      {
        title: "Codecademy — Learn Python 3 (Free tier)",
        url: "https://www.codecademy.com/learn/learn-python-3",
        description:
          "Guided coding exercises in a browser IDE. Complete the first module on syntax and variables.",
        estimatedMinutes: 25,
        type: "exercise",
      },
    ],
  },
  {
    id: "tryit-python-flow",
    nodePathId: "technology/python/control-flow-functions",
    treePathId: "technology/python",
    title: "Try It: Logic & Functions",
    description:
      "Write your first loops and functions. These resources guide you through building small programs that actually do something useful.",
    reflectionPrompts: [
      "Did breaking problems into functions feel natural or forced?",
      "How quickly did you go from following along to trying your own variations?",
      "Did you enjoy the problem-solving aspect?",
    ],
    traitProfile: { technical: 3, analytical: 3, patience: 2 },
    resources: [
      {
        title: "Automate the Boring Stuff — Ch. 2: Flow Control",
        url: "https://automatetheboringstuff.com/2e/chapter2/",
        description:
          "Read and try the examples from this classic free book. Focus on if/else, while, and for loops.",
        estimatedMinutes: 30,
        type: "tutorial",
      },
      {
        title: "Python Functions — Real Python",
        url: "https://realpython.com/defining-your-own-python-function/",
        description:
          "Step-by-step guide to writing functions. Try defining 2-3 of your own.",
        estimatedMinutes: 25,
        type: "tutorial",
      },
    ],
  },
  {
    id: "tryit-python-errors",
    nodePathId: "technology/python/error-handling-debugging",
    treePathId: "technology/python",
    title: "Try It: Error Handling",
    description:
      "Learn to write code that fails gracefully. Try/except blocks are how Python programs handle the unexpected.",
    reflectionPrompts: [
      "Did thinking about what could go wrong feel tedious or satisfying?",
      "Were you comfortable with the idea of raising your own errors?",
      "Does defensive programming appeal to you?",
    ],
    traitProfile: { technical: 2, analytical: 2, patience: 3 },
    resources: [
      {
        title: "Python Exceptions — Real Python",
        url: "https://realpython.com/python-exceptions/",
        description:
          "Comprehensive guide to try/except, raise, and custom exceptions. Try the interactive examples.",
        estimatedMinutes: 25,
        type: "tutorial",
      },
      {
        title: "CS50P — Lecture 3: Exceptions",
        url: "https://cs50.harvard.edu/python/2022/weeks/3/",
        description:
          "Harvard's take on error handling in Python. Watch the lecture and try the problem set.",
        estimatedMinutes: 30,
        type: "course",
      },
    ],
  },
];
