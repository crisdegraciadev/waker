import type { ExerciseDifficulty } from "./exercise-difficulty.type";
import type { ExerciseType } from "./exercise-type.type";

export type FilterExerciseDto = {
  name: string | null;
  difficulty: ExerciseDifficulty[];
  type: ExerciseType[];
};
