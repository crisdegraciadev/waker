import { Progression } from "@prisma/client";

export class ProgressionEntity implements Progression {
  id: number;

  workoutId: number;

  createdAt: Date;

  constructor(partial: Partial<ProgressionEntity>) {
    Object.assign(this, partial);
  }
}
