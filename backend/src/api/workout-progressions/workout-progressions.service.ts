import { Injectable, NotFoundException } from "@nestjs/common";
import { WorkoutProgression } from "@prisma/client";
import { PaginationDto } from "~/components/dtos/pagination.dto";
import { PageEntity } from "~/components/entities/page.entity";
import { SortOrder } from "~/components/utils/types";
import { DatabaseService } from "~/shared/database.service";
import { PaginationService } from "~/shared/pagination.service";
import { SortWorkoutProgressionDto } from "./dto/sort-workout-progression.dto";
import { WorkoutProgressionWhere } from "./entities/workout-progression-where.type";
import { WorkoutProgressionEntity } from "./entities/workout-progression.entity";

@Injectable()
export class WorkoutProgressionsService {
  constructor(
    private db: DatabaseService,
    private paginationService: PaginationService,
  ) {}

  async create(workoutId: number, userId: number) {
    await this.workoutExistsGuard(workoutId, userId);

    const workoutProgression = await this.db.workoutProgression.create({
      data: { workoutId },
    });

    return new WorkoutProgressionEntity(workoutProgression);
  }

  async findAll(pagination: PaginationDto, sort: SortWorkoutProgressionDto, workoutId: number): Promise<PageEntity<WorkoutProgressionEntity>> {
    const { page, limit } = pagination;
    const { sortBy, order } = sort;

    const where: WorkoutProgressionWhere = {
      workoutId,
    };

    const orderBy = sortBy ? { [sortBy]: order || SortOrder.ASC } : { createdAt: order || SortOrder.DESC};

    return this.paginationService.paginate<WorkoutProgression, "WorkoutProgression", WorkoutProgressionEntity>({
      modelName: "WorkoutProgression",
      pageNumber: page,
      limit,
      where,
      orderBy,
      mapper: (workoutProgressions) => workoutProgressions.map((wp) => new WorkoutProgressionEntity(wp)),
    });
  }

  async findOne(id: number) {
    const workoutProgression = await this.workoutProgressionExistsGuard(id);
    return new WorkoutProgressionEntity(workoutProgression);
  }

  async remove(id: number) {
    await this.workoutProgressionExistsGuard(id);

    await this.db.workoutProgression.delete({
      where: { id },
    });
  }

  private async workoutExistsGuard(id: number, userId: number) {
    const workout = await this.db.workout.findUnique({
      where: { id, userId },
    });

    if (!workout) {
      throw new NotFoundException("workout not found");
    }

    return workout;
  }

  private async workoutProgressionExistsGuard(id: number) {
    const workoutProgression = await this.db.workoutProgression.findUnique({
      where: { id },
    });

    if (!workoutProgression) {
      throw new NotFoundException("workout-progression not found");
    }

    return workoutProgression;
  }
}
