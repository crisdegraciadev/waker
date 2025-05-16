import { Progression } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

export class ProgressionEntity implements Progression {
  id: number;

  workoutId: number;

  createdAt: Date;

  activitiesOrder: JsonValue;

  constructor(partial: Partial<ProgressionEntity>) {
    Object.assign(this, partial);
  }
}
