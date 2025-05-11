import { Injectable } from "@nestjs/common";
import { Progression, Workout } from "@prisma/client";
import { PaginationDto } from "~/components/dtos/pagination.dto";
import { PageEntity } from "~/components/entities/page.entity";
import { SortOrder } from "~/components/utils/types";
import { DatabaseService } from "~/shared/services/database.service";
import { EntityVerifierService } from "~/shared/services/entity-verifier.service";
import { PaginationService } from "~/shared/services/pagination.service";
import { SortProgressionDto } from "./dto/sort-progression.dto";
import { ProgressionWhere } from "./entities/progression-where.type";
import { ProgressionEntity } from "./entities/progression.entity";

@Injectable()
export class ProgressionsService {
  constructor(
    private db: DatabaseService,
    private paginationService: PaginationService,
    private entityVerifier: EntityVerifierService,
  ) {}

  async create(workoutId: number, userId: number) {
    await this.workoutExistsGuard(workoutId, userId);

    const progression = await this.db.progression.create({
      data: { workoutId },
    });

    return new ProgressionEntity(progression);
  }

  async findAll(pagination: PaginationDto, sort: SortProgressionDto, workoutId: number, userId: number): Promise<PageEntity<ProgressionEntity>> {
    await this.workoutExistsGuard(workoutId, userId);

    const { page, limit } = pagination;
    const { sortBy, order } = sort;

    const where: ProgressionWhere = {
      workoutId,
    };

    const orderBy = sortBy ? { [sortBy]: order || SortOrder.ASC } : { createdAt: order || SortOrder.DESC };

    return this.paginationService.paginate<Progression, "Progression", ProgressionEntity>({
      modelName: "Progression",
      pageNumber: page,
      limit,
      where,
      orderBy,
      mapper: (progression) => progression.map((wp) => new ProgressionEntity(wp)),
    });
  }

  async findOne(id: number, workoutId: number, userId: number) {
    await this.workoutExistsGuard(workoutId, userId);
    const progression = await this.progressionExistsGuard(id, workoutId);
    return new ProgressionEntity(progression);
  }

  async remove(id: number, workoutId: number, userId: number) {
    await this.workoutExistsGuard(workoutId, userId);
    await this.progressionExistsGuard(id, workoutId);

    await this.db.progression.delete({
      where: { id, workoutId },
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
}
