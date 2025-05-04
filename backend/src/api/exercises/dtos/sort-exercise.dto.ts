import { IsEnum, IsOptional } from "class-validator";
import { SortOrder } from "~/components/utils/types";


export class SortExerciseDto {
  @IsEnum(["name", "difficulty", "type", "createdAt"])
  @IsOptional()
  sortBy?: "name" | "difficulty" | "type" | "createdAt";

  @IsEnum(SortOrder)
  @IsOptional()
  order?: SortOrder;
} 
