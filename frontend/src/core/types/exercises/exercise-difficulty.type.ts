export const EXERCISE_DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;
export type ExerciseDifficulty = (typeof EXERCISE_DIFFICULTIES)[number];
