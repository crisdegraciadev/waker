import type { ExerciseDifficulty } from "./exercise-difficulty.type";
import type { ExerciseType } from "./exercise-type.type";

export type FilterExerciseDto = {
  difficulty: ExerciseDifficulty[];
  type: ExerciseType[];
};
