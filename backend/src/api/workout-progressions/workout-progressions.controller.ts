import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { PaginationDto } from "~/components/dtos/pagination.dto";
import { SortWorkoutProgressionDto } from "./dto/sort-workout-progression.dto";
import { WorkoutProgressionsService } from "./workout-progressions.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { GetUser } from "~/components/decorators/get-user.decorator";

@Controller("workouts/:workoutId/progressions")
@UseGuards(JwtAuthGuard)
export class WorkoutProgressionsController {
  constructor(private readonly workoutProgressionsService: WorkoutProgressionsService) {}

  @Post()
  create(@Param("workoutId", ParseIntPipe) workoutId: number, @GetUser("id") userId: number) {
    return this.workoutProgressionsService.create(workoutId, userId);
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
  @HttpCode(204)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.workoutProgressionsService.remove(id);
  }
}
