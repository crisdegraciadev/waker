import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DatabaseService } from "./database.service";

export type ModelNames = (typeof Prisma.ModelName)[keyof typeof Prisma.ModelName];

type PrismaOperations<ModelName extends ModelNames> = Prisma.TypeMap["model"][ModelName]["operations"];
type PrismaFindManyArgs<ModelName extends ModelNames> = PrismaOperations<ModelName>["findMany"]["args"];

type PaginationOptions<ModelName extends ModelNames> = {
  modelName: ModelName;
  pageNumber: number;
  limit: number;

  where?: PrismaFindManyArgs<ModelName>["where"];
  orderBy?: PrismaFindManyArgs<ModelName>["orderBy"];
};

@Injectable()
export class PaginationService {
  constructor(private db: DatabaseService) { }

  async paginate<Model, ModelName extends ModelNames>({ pageNumber = 0, limit = 10, modelName, where, orderBy }: PaginationOptions<ModelName>) {
    const skip = (pageNumber - 1) * limit;
    const take = limit;

    const totalCount = await this.db[modelName as string].count({
      where,
    });

    const items: Model[] = await this.db[modelName as string].findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return {
      items,
      pageable: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        pageNumber,
        prevPage: pageNumber === 0 ? 0 : pageNumber - 1,
        limit,
      },
    };
  }
}
