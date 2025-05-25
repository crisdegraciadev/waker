import type { ExerciseDifficulty } from "./exercise-difficulty.type";
import type { ExerciseType } from "./exercise-type.type";

export type CreateExerciseDto = {
  name: string;
  difficulty: ExerciseDifficulty;
  type: ExerciseType;
};
