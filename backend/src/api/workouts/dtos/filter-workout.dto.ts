import { WorkoutType } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class FilterWorkoutDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(WorkoutType)
  @IsOptional()
  type?: WorkoutType;
}
