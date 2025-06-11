import { ExerciseDifficulty, ExerciseType } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class FilterExerciseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(ExerciseDifficulty, { each: true })
  @IsOptional()
  @Transform(({ obj }) => {
    const value = obj["difficulty[]"];
    const values = Array.isArray(value) ? value : [value];
    return values.filter((v) => !!v);
  })
  "difficulty[]"?: ExerciseDifficulty[];

  @IsEnum(ExerciseType, { each: true })
  @IsOptional()
  @Transform(({ obj }) => {
    const value = obj["type[]"];
    const values = Array.isArray(value) ? value : [value];
    return values.filter((v) => !!v);
  })
  "type[]"?: ExerciseType[];
}
