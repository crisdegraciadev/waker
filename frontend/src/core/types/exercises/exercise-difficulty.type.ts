export const EXERCISE_DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;

export const EXERICSE_DIFFICULTIES_LABELS = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
} as const;

export type ExerciseDifficulty = (typeof EXERCISE_DIFFICULTIES)[number];
