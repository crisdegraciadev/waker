import { ActivityImprovement } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";

export class CreateActivityDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  sets: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  reps: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  order: number;

  @IsEnum(ActivityImprovement)
  @IsOptional()
  improvement?: ActivityImprovement;

  @IsNumber()
  @IsNotEmpty()
  exerciseId: number;
}
