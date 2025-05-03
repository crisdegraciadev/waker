import { Injectable, NotFoundException } from "@nestjs/common";
import { PaginationDto } from "~/components/dtos/pagination.dto";
import { DatabaseService } from "~/shared/database.service";
import { PaginationService } from "~/shared/pagination.service";
import { CreateExerciseDto } from "./dtos/create-exercise.dto";
import { UpdateExerciseDto } from "./dtos/update-exercise.dto";
import { ExerciseEntity } from "./entities/exercise.entity";
import { PageEntity } from "~/components/entities/page.entity";
import { Exercise } from "@prisma/client";

@Injectable()
export class ExercisesService {
  constructor(
    private db: DatabaseService,
    private paginationService: PaginationService,
  ) { }

  async create(createExerciseDto: CreateExerciseDto, userId: number) {
    const exercise = await this.db.exercise.create({
      data: { ...createExerciseDto, userId },
    });

    return new ExerciseEntity(exercise);
  }

  async findAll({ pageNumber, limit }: PaginationDto, userId: number) {
    const { items, pageable } = await this.paginationService.paginate<Exercise, "Exercise">({
      modelName: "Exercise",
      pageNumber,
      limit,
      where: { userId },
    });

    const page = new PageEntity({
      data: items.map((e) => new ExerciseEntity(e)),
      pageable,
    });

    return page;
  }

  async findOne(id: number, userId: number) {
    const exercise = await this.db.exercise.findUnique({
      where: { id, userId },
    });

    if (!exercise) {
      throw new NotFoundException("exercise not found");
    }

    return new ExerciseEntity(exercise);
  }

  update(id: number, updateExerciseDto: UpdateExerciseDto) {
    return `This action updates a #${id} exercise`;
  }

  remove(id: number) {
    return `This action removes a #${id} exercise`;
  }
}
