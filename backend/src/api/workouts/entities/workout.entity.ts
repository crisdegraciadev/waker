import { Workout } from "@prisma/client";
import { WorkoutType } from "./workout-type.enum";

export class WorkoutEntity implements Workout {
  id: number;

  name: string;

  type: WorkoutType;

  userId: number;

  createdAt: Date;

  constructor(partial: Partial<WorkoutEntity>) {
    Object.assign(this, partial);
  }
}
