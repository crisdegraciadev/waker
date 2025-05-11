import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { ActivitiesService } from "./activities.service";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";
import { GetUser } from "~/components/decorators/get-user.decorator";

@Controller("workouts/:workoutId/progressions/:progressionId/activities")
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

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
  findAll() {
    return this.activitiesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.activitiesService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateActivityDto: UpdateActivityDto) {
    return this.activitiesService.update(+id, updateActivityDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.activitiesService.remove(+id);
  }
}
