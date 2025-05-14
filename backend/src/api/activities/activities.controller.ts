import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { ActivitiesService } from "./activities.service";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";
import { GetUser } from "~/components/decorators/get-user.decorator";

@Controller("workouts/:workoutId/progressions/:progressionId/activities")
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) { }

  @Post()
  create(
    @Body() createActivityDto: CreateActivityDto,
    @Param("workoutId", ParseIntPipe) workoutId: number,
    @Param("progressionId", ParseIntPipe) progressionId: number,
    @GetUser("id") userId: number,
  ) {
    return this.activitiesService.create(createActivityDto, workoutId, progressionId, userId);
  }

  @Get()
  findAll(
    @Param("workoutId", ParseIntPipe) workoutId: number,
    @Param("progressionId", ParseIntPipe) progressionId: number,
    @GetUser("id") userId: number,
  ) {
    return this.activitiesService.findAll(workoutId, progressionId, userId);
  }

  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
    @Param("workoutId", ParseIntPipe) workoutId: number,
    @Param("progressionId", ParseIntPipe) progressionId: number,
    @GetUser("id") userId: number,
  ) {
    return this.activitiesService.findOne(id, workoutId, progressionId, userId);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Param("workoutId", ParseIntPipe) workoutId: number,
    @Param("progressionId", ParseIntPipe) progressionId: number,
    @Body() updateActivityDto: UpdateActivityDto,
    @GetUser("id") userId: number,
  ) {
    return this.activitiesService.update(id, updateActivityDto, workoutId, progressionId, userId);
  }

  @Delete(":id")
  @HttpCode(204)
  remove(
    @Param("id", ParseIntPipe) id: number,
    @Param("workoutId", ParseIntPipe) workoutId: number,
    @Param("progressionId", ParseIntPipe) progressionId: number,
    @GetUser("id") userId: number,
  ) {
    return this.activitiesService.remove(id, workoutId, progressionId, userId);
  }
}
