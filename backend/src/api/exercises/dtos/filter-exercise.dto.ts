import { ExerciseDifficulty, ExerciseType } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class FilterExerciseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(ExerciseDifficulty)
  @IsOptional()
  difficulty?: ExerciseDifficulty;

  @IsEnum(ExerciseType)
  @IsOptional()
  type?: ExerciseType;
} 