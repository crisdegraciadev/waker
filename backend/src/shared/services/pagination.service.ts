import { Injectable } from "@nestjs/common";
import { PageEntity } from "~/components/entities/page.entity";
import { ModelNames, PrismaFindManyArgs } from "../types";
import { DatabaseService } from "./database.service";

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
  constructor(private db: DatabaseService) { }

  async paginate<Model, ModelName extends ModelNames, Entity>(options: PaginationOptions<Model, ModelName, Entity>) {
    const { pageNumber, limit, modelName, where, orderBy, mapper } = options;

    const skip = pageNumber * limit;
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
