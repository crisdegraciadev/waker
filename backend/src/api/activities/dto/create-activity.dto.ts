import { ActivityImprovement } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateActivityDto {
  @IsNumber()
  @IsNotEmpty()
  sets: number;

  @IsNumber()
  @IsNotEmpty()
  reps: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsNotEmpty()
  order: number;

  @IsEnum(ActivityImprovement)
  @IsOptional()
  improvement?: ActivityImprovement;

  @IsNumber()
  @IsNotEmpty()
  exerciseId: number;
}
