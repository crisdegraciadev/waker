import { ExerciseDifficulty, ExerciseType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ExerciseType)
  @IsNotEmpty()
  type: ExerciseType;

  @IsEnum(ExerciseDifficulty)
  @IsNotEmpty()
  difficulty: ExerciseDifficulty;
}
