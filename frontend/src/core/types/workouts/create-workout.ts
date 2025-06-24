import type { WorkoutType } from "./workout-type";

export type CreateWorkoutDto = {
  name: string;
  type: WorkoutType;
};
