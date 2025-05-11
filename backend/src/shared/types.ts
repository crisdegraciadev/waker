import { Prisma } from "@prisma/client";

export type ModelNames = (typeof Prisma.ModelName)[keyof typeof Prisma.ModelName];

type PrismaOperations<ModelName extends ModelNames> = Prisma.TypeMap["model"][ModelName]["operations"];
export type PrismaFindManyArgs<ModelName extends ModelNames> = PrismaOperations<ModelName>["findMany"]["args"];
