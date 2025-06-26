export const EXERCISE_TYPES = ["BODY_WEIGHT", "WEIGHT", "STRETCH", "MOBILITY"] as const;

export const EXERCISE_TYPES_LABELS = {
  BODY_WEIGHT: "Body Weight",
  WEIGHT: "Weight",
  STRETCH: "Stretch",
  MOBILITY: "Mobility",
} as const;

export type ExerciseType = (typeof EXERCISE_TYPES)[number];
