import { IsArray, IsNotEmpty } from "class-validator";

export class UpdateProgressionDto {
  @IsNotEmpty()
  @IsArray()
  activitiesOrder: number[];
}
