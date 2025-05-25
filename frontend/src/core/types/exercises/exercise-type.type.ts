export const EXERCISE_TYPES = ["BODY_WEIGHT", "WEIGHT", "STRETCH", "MOBILITY"] as const;
export type ExerciseType = (typeof EXERCISE_TYPES)[number];
