import { WorkoutType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateWorkoutDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(WorkoutType)
  @IsNotEmpty()
  type: WorkoutType;
}
