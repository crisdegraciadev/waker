export const WORKOUT_TYPES = ["CALISTHENICS", "WEIGHTS", "MIXED", "CARDIO", "TABATA", "HIIT"] as const;

export const WORKOUT_TYPES_LABELS = {
  CALISTHENICS: "Calisthenics",
  WEIGHTS: "Weights",
  MIXED: "Mixed",
  CARDIO: "Cardio",
  TABATA: "Tabata",
  HIIT: "HIIT",
} as const;

export type WorkoutType = (typeof WORKOUT_TYPES)[number];
