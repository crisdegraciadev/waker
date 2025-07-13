import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { GetUser } from "~/components/decorators/get-user.decorator";
import { PaginationDto } from "~/components/dtos/pagination.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { ProgressionsService } from "./progressions.service";
import { SortProgressionDto } from "./dto/sort-progression.dto";
import { UpdateProgressionDto } from "./dto/update-progression.dto";
import { CreateProgressionDto } from "./dto/create-progression.dto";
import { ActivitiesService } from "../activities/activities.service";

@Controller("workouts/:workoutId/progressions")
@UseGuards(JwtAuthGuard)
export class ProgressionsController {
  constructor(
    private readonly progressionsService: ProgressionsService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  @Post()
  async create(
    @Body() createProgressionDto: CreateProgressionDto,
    @Param("workoutId", ParseIntPipe) workoutId: number,
    @GetUser("id") userId: number,
  ) {
    const { id: progressionId } = await this.progressionsService.create(createProgressionDto, workoutId, userId);
    const { activities } = createProgressionDto;

    const createdActivities = await Promise.all(
      activities.map(async (activity) => await this.activitiesService.create(activity, workoutId, progressionId, userId)),
    );

    const activitiesOrder = createdActivities.map(({ id }) => id);

    return this.progressionsService.update(progressionId, workoutId, userId, { activitiesOrder });
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
