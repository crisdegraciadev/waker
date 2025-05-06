import { IsEnum, IsOptional } from "class-validator";
import { SortOrder } from "~/components/utils/types";

export class SortWorkoutDto {
  @IsOptional()
  @IsEnum(['name', 'createdAt', 'updatedAt'])
  sortBy?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}
