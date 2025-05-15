import { Activity, ActivityImprovement } from "@prisma/client";

export class ActivityEntity implements Activity {
  id: number;


  sets: number;

  reps: number;

  weight: number | null;

  improvement: ActivityImprovement | null;

  exerciseId: number;

  progressionId: number;

  constructor(partial: Partial<ActivityEntity>) {
    Object.assign(this, partial);
  }
}
