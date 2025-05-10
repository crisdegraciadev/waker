import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpCode } from "@nestjs/common";
import { WorkoutsService } from "./workouts.service";
import { CreateWorkoutDto } from "./dtos/create-workout.dto";
import { UpdateWorkoutDto } from "./dtos/update-workout.dto";
import { FilterWorkoutDto } from "./dtos/filter-workout.dto";
import { PaginationDto } from "~/components/dtos/pagination.dto";
import { SortWorkoutDto } from "./dtos/sort-workout.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { GetUser } from "~/components/decorators/get-user.decorator";

@Controller("workouts")
@UseGuards(JwtAuthGuard)
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  create(@Body() createWorkoutDto: CreateWorkoutDto, @GetUser("id") userId: number) {
    return this.workoutsService.create(createWorkoutDto, userId);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto, @Query() filters: FilterWorkoutDto, @Query() sort: SortWorkoutDto, @GetUser("id") userId: number) {
    return this.workoutsService.findAll(pagination, filters, sort, userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @GetUser("id") userId: number) {
    return this.workoutsService.findOne(+id, userId);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateWorkoutDto: UpdateWorkoutDto, @GetUser("id") userId: number) {
    return this.workoutsService.update(+id, updateWorkoutDto, userId);
  }

  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id") id: string, @GetUser("id") userId: number) {
    return this.workoutsService.remove(+id, userId);
  }
}
