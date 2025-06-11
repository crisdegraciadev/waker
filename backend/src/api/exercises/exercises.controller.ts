import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { GetUser } from "~/components/decorators/get-user.decorator";
import { PaginationDto } from "~/components/dtos/pagination.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { CreateExerciseDto } from "./dtos/create-exercise.dto";
import { FilterExerciseDto } from "./dtos/filter-exercise.dto";
import { SortExerciseDto } from "./dtos/sort-exercise.dto";
import { UpdateExerciseDto } from "./dtos/update-exercise.dto";
import { ExercisesService } from "./exercises.service";

@Controller("exercises")
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createExerciseDto: CreateExerciseDto, @GetUser("id") userId: number) {
    return this.exercisesService.create(createExerciseDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterExerciseDto,
    @Query() sortDto: SortExerciseDto,
    @GetUser("id") userId: number,
  ) {
    console.log({ filterDto  });
    return this.exercisesService.findAll(paginationDto, filterDto, sortDto, userId);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  findOne(@Param("id", ParseIntPipe) id: number, @GetUser("id") userId: number) {
    return this.exercisesService.findOne(id, userId);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  update(@Param("id", ParseIntPipe) id: number, @Body() updateExerciseDto: UpdateExerciseDto, @GetUser("id") userId: number) {
    return this.exercisesService.update(id, updateExerciseDto, userId);
  }

  @Delete(":id")
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  remove(@Param("id", ParseIntPipe) id: number, @GetUser("id") userId: number) {
    return this.exercisesService.remove(id, userId);
  }
}
