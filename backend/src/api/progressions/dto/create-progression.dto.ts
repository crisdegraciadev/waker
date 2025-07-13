import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { CreateActivityDto } from "~/api/activities/dto/create-activity.dto";

export class CreateProgressionDto {
  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @Type(() => CreateActivityDto)
  activities: CreateActivityDto[];
}
