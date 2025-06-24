import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Exercise, Prisma } from "@prisma/client";
import { PaginationDto } from "~/components/dtos/pagination.dto";
import { PageEntity } from "~/components/entities/page.entity";
import { DatabaseService } from "~/shared/services/database.service";
import { PaginationService } from "~/shared/services/pagination.service";
import { CreateExerciseDto } from "./dtos/create-exercise.dto";
import { FilterExerciseDto } from "./dtos/filter-exercise.dto";
import { UpdateExerciseDto } from "./dtos/update-exercise.dto";
import { ExerciseWhere } from "./entities/exercise-where.type";
import { ExerciseEntity } from "./entities/exercise.entity";
import { SortExerciseDto } from "./dtos/sort-exercise.dto";
import { SortOrder } from "~/components/utils/types";

@Injectable()
export class ExercisesService {
  constructor(
    private db: DatabaseService,
    private paginationService: PaginationService,
  ) { }

  async create(createExerciseDto: CreateExerciseDto, userId: number): Promise<ExerciseEntity> {
    const { name } = createExerciseDto;
    await this.isNameUniqueGuard(name, userId);

    const exercise = await this.db.exercise.create({
      data: { ...createExerciseDto, userId },
    });

    return new ExerciseEntity(exercise);
  }

  async findAll(pagination: PaginationDto, filters: FilterExerciseDto, sort: SortExerciseDto, userId: number): Promise<PageEntity<ExerciseEntity>> {
    const { page, limit } = pagination;
    const { "difficulty[]": difficulty, "type[]": type, name } = filters;
    const { sortBy, order } = sort;

    const baseFilters: ExerciseWhere = {
      userId,
      ...(name && {
        name: {
          contains: name,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
    };

    const difficultyFilters = difficulty?.map((d) => ({ difficulty: d })) ?? [];
    const typeFilters = type?.map((t) => ({ type: t })) ?? [];

    const facetedFilters: ExerciseWhere = {
      OR: [...difficultyFilters, ...typeFilters],
    };

    const where: ExerciseWhere = {
      ...baseFilters,
      ...((difficultyFilters.length || typeFilters.length) && facetedFilters),
    };

    const orderBy = sortBy ? { [sortBy]: order || SortOrder.ASC } : { name: order || SortOrder.ASC };

    return this.paginationService.paginate<Exercise, "Exercise", ExerciseEntity>({
      modelName: "Exercise",
      pageNumber: page,
      limit,
      where: where,
      orderBy,
      mapper: (exercises) => exercises.map((e) => new ExerciseEntity(e)),
    });
  }

  async findOne(id: number, userId: number): Promise<ExerciseEntity> {
    const exercise = await this.exerciseExistsGuard(id, userId);
    return new ExerciseEntity(exercise);
  }

  async update(id: number, updateExerciseDto: UpdateExerciseDto, userId: number): Promise<ExerciseEntity> {
    const exerciseToUpdate = await this.exerciseExistsGuard(id, userId);

    const { name } = updateExerciseDto;

    if (name && name !== exerciseToUpdate.name) {
      await this.isNameUniqueGuard(name, userId);
    }

    const exercise = await this.db.exercise.update({
      where: { id, userId },
      data: updateExerciseDto,
    });

    return new ExerciseEntity(exercise);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.exerciseExistsGuard(id, userId);

    await this.db.exercise.delete({
      where: { id, userId },
    });
  }

  private async exerciseExistsGuard(id: number, userId: number) {
    const exercise = await this.db.exercise.findUnique({
      where: { id, userId },
    });

    if (!exercise) {
      throw new NotFoundException("exercise not found");
    }

    return exercise;
  }

  private async isNameUniqueGuard(name: string, userId: number) {
    const isNameAlreadyInUse = await this.db.exercise.findUnique({
      where: {
        exerciseIdentifier: {
          userId,
          name,
        },
      },
    });

    if (isNameAlreadyInUse) {
      throw new ConflictException("name is already in use");
    }
  }
}
