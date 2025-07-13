import { OmitType, PartialType } from "@nestjs/mapped-types";
import { IsArray, IsNotEmpty, IsOptional } from "class-validator";
import { CreateProgressionDto } from "./create-progression.dto";

export class UpdateProgressionDto extends PartialType(OmitType(CreateProgressionDto, ["activities"] as const)) {
  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  activitiesOrder?: number[];
}
