import type { ExerciseDifficulty } from "./exercise-difficulty.type";
import type { ExerciseType } from "./exercise-type.type";

export type ExerciseEntity = {
  id: number;
  name: string;
  difficulty: ExerciseDifficulty;
  type: ExerciseType;
  userId: number;
  createdAt: Date;
};
