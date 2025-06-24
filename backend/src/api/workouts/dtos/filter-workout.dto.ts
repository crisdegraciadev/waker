import { WorkoutType } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class FilterWorkoutDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(WorkoutType, { each: true })
  @IsOptional()
  @Transform(({ obj }) => {
    const value = obj["type[]"];
    const values = Array.isArray(value) ? value : [value];
    return values.filter((v) => !!v);
  })
  "type[]"?: WorkoutType[];
}
