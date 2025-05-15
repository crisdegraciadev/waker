import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { GetUser } from "~/components/decorators/get-user.decorator";
import { PaginationDto } from "~/components/dtos/pagination.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { ProgressionsService } from "./progressions.service";
import { SortProgressionDto } from "./dto/sort-progression.dto";
import { UpdateProgressionDto } from "./dto/update-progression.dto";

@Controller("workouts/:workoutId/progressions")
@UseGuards(JwtAuthGuard)
export class ProgressionsController {
  constructor(private readonly progressionsService: ProgressionsService) { }

  @Post()
  create(@Param("workoutId", ParseIntPipe) workoutId: number, @GetUser("id") userId: number) {
    return this.progressionsService.create(workoutId, userId);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() sortDto: SortProgressionDto,
    @Param("workoutId", ParseIntPipe) workoutId: number,
    @GetUser("id") userId: number,
  ) {
    return this.progressionsService.findAll(paginationDto, sortDto, workoutId, userId);
  }

  @Get(":id")
  findOne(@Param("workoutId", ParseIntPipe) workoutId: number, @Param("id", ParseIntPipe) id: number, @GetUser("id") userId: number) {
    return this.progressionsService.findOne(id, workoutId, userId);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Param("workoutId", ParseIntPipe) workoutId: number,
    @Body() updateProgressionDto: UpdateProgressionDto,
    @GetUser("id") userId: number,
  ) {
    return this.progressionsService.update(id, workoutId, userId, updateProgressionDto);
  }

  @Delete(":id")
  @HttpCode(204)
  remove(@Param("workoutId", ParseIntPipe) workoutId: number, @Param("id", ParseIntPipe) id: number, @GetUser("id") userId: number) {
    return this.progressionsService.remove(id, workoutId, userId);
  }
}
