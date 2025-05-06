import { WorkoutProgression } from "@prisma/client";

export class WorkoutProgressionEntity implements WorkoutProgression {
  id: number;

  workoutId: number;

  createdAt: Date;

  constructor(partial: Partial<WorkoutProgressionEntity>) {
    Object.assign(this, partial);
  }
}
