import { IsEnum, IsOptional } from "class-validator";
import { SortOrder } from "~/components/utils/types";

export class SortProgressionDto {
  @IsEnum(["createdAt"])
  @IsOptional()
  sortBy?: "createdAt";

  @IsEnum(SortOrder)
  @IsOptional()
  order?: SortOrder;
}
