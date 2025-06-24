import type { WorkoutType } from "./workout-type";

export type Workout = {
  id: number;
  name: string;
  type: WorkoutType;
  userId: number;
  createdAt: Date;
};
