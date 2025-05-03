import { Exercise } from "@prisma/client";
import { ExerciseDifficulty } from "./exercise-difficulty.enum";
import { ExerciseType } from "./exercise-type.enum";

export class ExerciseEntity implements Exercise {
  constructor(partial: Partial<ExerciseEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  name: string;
  difficulty: ExerciseDifficulty;
  type: ExerciseType;
  userId: number;
}
