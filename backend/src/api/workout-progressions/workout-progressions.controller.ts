import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { PaginationDto } from "~/components/dtos/pagination.dto";
import { CreateWorkoutProgressionDto } from "./dto/create-workout-progression.dto";
import { SortWorkoutProgressionDto } from "./dto/sort-workout-progression.dto";
import { WorkoutProgressionsService } from "./workout-progressions.service";

@Controller("workouts/:workoutId/progressions")
export class WorkoutProgressionsController {
  constructor(private readonly workoutProgressionsService: WorkoutProgressionsService) { }

  @Post()
  create(@Body() createWorkoutProgressionDto: CreateWorkoutProgressionDto) {
    return this.workoutProgressionsService.create(createWorkoutProgressionDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto, @Query() sortDto: SortWorkoutProgressionDto, @Param("workoutId", ParseIntPipe) workoutId: number) {
    return this.workoutProgressionsService.findAll(paginationDto, sortDto, workoutId);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.workoutProgressionsService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.workoutProgressionsService.remove(id);
  }
}
