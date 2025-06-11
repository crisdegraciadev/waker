import { ExerciseDifficulty, ExerciseType } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class FilterExerciseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(ExerciseDifficulty, { each: true })
  @IsOptional()
  "difficulty[]"?: ExerciseDifficulty[];

  @IsEnum(ExerciseType, { each: true })
  @IsOptional()
  "type[]"?: ExerciseType[];
}
