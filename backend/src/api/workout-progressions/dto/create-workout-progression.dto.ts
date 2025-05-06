import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateWorkoutProgressionDto {
  @IsNumber()
  @IsNotEmpty()
  workoutId: number;
}
