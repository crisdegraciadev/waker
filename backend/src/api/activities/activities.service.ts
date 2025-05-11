import { Injectable } from "@nestjs/common";
import { Exercise, Progression, Workout } from "@prisma/client";
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
  ) {}

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

  findAll() {
    return `This action returns all activities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} activity`;
  }

  update(id: number, updateActivityDto: UpdateActivityDto) {
    return `This action updates a #${id} activity`;
  }

  remove(id: number) {
    return `This action removes a #${id} activity`;
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
}
