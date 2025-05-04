import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DatabaseService } from "./database.service";
import { PageEntity } from "~/components/entities/page.entity";

export type ModelNames = (typeof Prisma.ModelName)[keyof typeof Prisma.ModelName];

type PrismaOperations<ModelName extends ModelNames> = Prisma.TypeMap["model"][ModelName]["operations"];
type PrismaFindManyArgs<ModelName extends ModelNames> = PrismaOperations<ModelName>["findMany"]["args"];

type PaginationOptions<Model, ModelName extends ModelNames, Entity> = {
  modelName: ModelName;
  pageNumber: number;
  limit: number;

  where?: PrismaFindManyArgs<ModelName>["where"];
  orderBy?: PrismaFindManyArgs<ModelName>["orderBy"];

  mapper: (models: Model[]) => Entity[];
};

@Injectable()
export class PaginationService {
  constructor(private db: DatabaseService) {}

  async paginate<Model, ModelName extends ModelNames, Entity>(options: PaginationOptions<Model, ModelName, Entity>) {
    const { pageNumber, limit, modelName, where, orderBy, mapper } = options;

    const skip = (pageNumber - 1) * limit;
    const take = limit;

    const items: Model[] = await this.db[modelName as string].findMany({
      where,
      orderBy,
      skip,
      take,
    });

    const data = mapper(items);

    const pageable = await this.generatePageable(options);

    return new PageEntity({ data, pageable });
  }

  private async generatePageable<Model, ModelName extends ModelNames, Entity>(options: PaginationOptions<Model, ModelName, Entity>) {
    const { pageNumber, limit, modelName, where } = options;

    const totalEntities = await this.db[modelName as string].count({
      where,
    });

    const pageSize = limit;
    const totalPages = Math.ceil(totalEntities / pageSize);

    const nextPage = pageNumber === totalPages ? pageNumber : pageNumber + 1;
    const prevPage = pageNumber === 1 ? 1 : pageNumber - 1;

    return {
      pageNumber,
      pageSize,
      totalEntities,
      totalPages,
      nextPage,
      prevPage,
    };
  }
}
