import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query } from "@nestjs/common";
import { ExercisesService } from "./exercises.service";
import { CreateExerciseDto } from "./dtos/create-exercise.dto";
import { UpdateExerciseDto } from "./dtos/update-exercise.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { GetUser } from "~/components/decorators/get-user.decorator";
import { PaginationDto } from "~/components/dtos/pagination.dto";

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
  findAll(@Query() paginationDto: PaginationDto, @GetUser("id") userId: number) {
    return this.exercisesService.findAll(paginationDto, userId);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  findOne(@Param("id", ParseIntPipe) id: number, @GetUser("id") userId: number) {
    return this.exercisesService.findOne(id, userId);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  update(@Param("id", ParseIntPipe) id: number, @Body() updateExerciseDto: UpdateExerciseDto) {
    return this.exercisesService.update(+id, updateExerciseDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.exercisesService.remove(+id);
  }
}
