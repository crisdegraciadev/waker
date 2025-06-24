import { ConflictException, Injectable } from "@nestjs/common";
import { Prisma, Workout } from "@prisma/client";
import { PaginationDto } from "~/components/dtos/pagination.dto";
import { PageEntity } from "~/components/entities/page.entity";
import { SortOrder } from "~/components/utils/types";
import { DatabaseService } from "~/shared/services/database.service";
import { EntityVerifierService } from "~/shared/services/entity-verifier.service";
import { PaginationService } from "~/shared/services/pagination.service";
import { CreateWorkoutDto } from "./dtos/create-workout.dto";
import { FilterWorkoutDto } from "./dtos/filter-workout.dto";
import { SortWorkoutDto } from "./dtos/sort-workout.dto";
import { UpdateWorkoutDto } from "./dtos/update-workout.dto";
import { WorkoutWhere } from "./entities/workout-where.type";
import { WorkoutEntity } from "./entities/workout.entity";

@Injectable()
export class WorkoutsService {
  constructor(
    private db: DatabaseService,
    private paginationService: PaginationService,
    private entityVerifier: EntityVerifierService,
  ) { }

  async create(createWorkoutDto: CreateWorkoutDto, userId: number): Promise<WorkoutEntity> {
    const { name } = createWorkoutDto;
    await this.isNameUniqueGuard(name, userId);

    const workout = await this.db.workout.create({
      data: { ...createWorkoutDto, userId },
    });

    return new WorkoutEntity(workout);
  }

  async findAll(pagination: PaginationDto, filters: FilterWorkoutDto, sort: SortWorkoutDto, userId: number): Promise<PageEntity<WorkoutEntity>> {
    const { page, limit } = pagination;
    const { "type[]": type, name } = filters;
    const { sortBy, order } = sort;

    const typeFilters = type?.map((t) => ({ type: t })) ?? [];

    const baseFilters: WorkoutWhere = {
      userId,
      ...(name && {
        name: {
          contains: name,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
    };

    const facetedFilters: WorkoutWhere = {
      OR: [...typeFilters],
    };

    const where: WorkoutWhere = {
      ...baseFilters,
      ...(typeFilters.length && facetedFilters),
    };

    const orderBy = sortBy ? { [sortBy]: order || SortOrder.ASC } : { name: order || SortOrder.ASC };

    return this.paginationService.paginate<Workout, "Workout", WorkoutEntity>({
      modelName: "Workout",
      pageNumber: page,
      limit,
      where,
      orderBy,
      mapper: (workouts) => workouts.map((w) => new WorkoutEntity(w)),
    });
  }

  async findOne(id: number, userId: number): Promise<WorkoutEntity> {
    const workout = await this.workoutExistsGuard(id, userId);

    return new WorkoutEntity(workout);
  }

  async update(id: number, updateWorkoutDto: UpdateWorkoutDto, userId: number): Promise<WorkoutEntity> {
    const workoutToUpdate = await this.workoutExistsGuard(id, userId);

    const { name } = updateWorkoutDto;

    if (name && name !== workoutToUpdate.name) {
      await this.isNameUniqueGuard(name, userId);
    }

    const workout = await this.db.workout.update({
      where: { id, userId },
      data: updateWorkoutDto,
    });

    return new WorkoutEntity(workout);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.workoutExistsGuard(id, userId);

    await this.db.workout.delete({
      where: { id, userId },
    });
  }

  private async isNameUniqueGuard(name: string, userId: number) {
    const isNameAlreadyInUse = await this.db.workout.findUnique({
      where: {
        workoutIdentifier: {
          userId,
          name,
        },
      },
    });

    if (isNameAlreadyInUse) {
      throw new ConflictException("name is already in use");
    }
  }

  private async workoutExistsGuard(id: number, userId: number) {
    return this.entityVerifier.verifyExists<Workout, "Workout">({
      modelName: "Workout",
      error: "workout not found",
      where: { id, userId },
    });
  }
}
