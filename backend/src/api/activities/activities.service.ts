import { Injectable } from "@nestjs/common";
import { Activity, Exercise, Progression, Workout } from "@prisma/client";
import { DatabaseService } from "~/shared/services/database.service";
import { EntityVerifierService } from "~/shared/services/entity-verifier.service";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";
import { ActivityEntity } from "./entities/activity.entity";

@Injectable()
export class ActivitiesService {
  constructor(
    private db: DatabaseService,
    private entityVerifier: EntityVerifierService,
  ) { }

  async create(createActivityDto: CreateActivityDto, workoutId: number, progressionId: number, userId: number) {
    const { exerciseId } = createActivityDto;

    await this.workoutExistsGuard(workoutId, userId);
    await this.progressionExistsGuard(progressionId, workoutId);
    await this.exerciseExistsGuard(exerciseId, userId);

    const activity = await this.db.activity.create({
      data: { ...createActivityDto, progressionId },
    });

    return new ActivityEntity(activity);
  }

  async findAll(workoutId: number, progressionId: number, userId: number) {
    await this.workoutExistsGuard(workoutId, userId);
    await this.progressionExistsGuard(progressionId, workoutId);

    const activities = await this.db.activity.findMany({
      where: { progressionId },
      orderBy: { order: "asc" },
    });

    return activities.map((a) => new ActivityEntity(a));
  }

  async findOne(id: number, workoutId: number, progressionId: number, userId: number) {
    await this.workoutExistsGuard(workoutId, userId);
    await this.progressionExistsGuard(progressionId, workoutId);

    const activity = await this.activityExistsGuard(id, progressionId);

    return new ActivityEntity(activity);
  }

  async update(id: number, updateActivityDto: UpdateActivityDto, workoutId: number, progressionId: number, userId: number) {
    await this.workoutExistsGuard(workoutId, userId);
    await this.progressionExistsGuard(progressionId, workoutId);
    await this.activityExistsGuard(id, progressionId);

    const activity = await this.db.activity.update({
      where: { id, progressionId },
      data: updateActivityDto,
    });

    return new ActivityEntity(activity);
  }

  async remove(id: number, workoutId: number, progressionId: number, userId: number) {
    await this.workoutExistsGuard(workoutId, userId);
    await this.progressionExistsGuard(progressionId, workoutId);
    await this.activityExistsGuard(id, progressionId);

    await this.db.activity.delete({
      where: { id, progressionId },
    });
  }

  private async workoutExistsGuard(id: number, userId: number) {
    return this.entityVerifier.verifyExists<Workout, "Workout">({
      modelName: "Workout",
      error: "workout not found",
      where: { id, userId },
    });
  }

  private async progressionExistsGuard(id: number, workoutId: number) {
    return this.entityVerifier.verifyExists<Progression, "Progression">({
      modelName: "Progression",
      error: "progression not found",
      where: { id, workoutId },
    });
  }

  private async exerciseExistsGuard(id: number, userId: number) {
    return this.entityVerifier.verifyExists<Exercise, "Exercise">({
      modelName: "Exercise",
      error: "exercise not found",
      where: { id, userId },
    });
  }

  private async activityExistsGuard(id: number, progressionId: number) {
    return this.entityVerifier.verifyExists<Activity, "Activity">({
      modelName: "Activity",
      error: "activity not found",
      where: { id, progressionId },
    });
  }
}
