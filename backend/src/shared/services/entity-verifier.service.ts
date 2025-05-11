import { Injectable, NotFoundException } from "@nestjs/common";
import { ModelNames, PrismaFindManyArgs } from "../types";
import { DatabaseService } from "./database.service";

type VerifierOptions<ModelName extends ModelNames> = {
  modelName: ModelName;
  where: PrismaFindManyArgs<ModelName>["where"];
  error: string;
};

@Injectable()
export class EntityVerifierService {
  constructor(private db: DatabaseService) {}

  async verifyExists<Model, ModelName extends ModelNames>(options: VerifierOptions<ModelName>): Promise<Model> {
    const { modelName, where, error } = options;

    const entity: Model = await this.db[modelName as string].findUnique({ where });

    if (!entity) {
      throw new NotFoundException(error);
    }

    return entity;
  }
}
