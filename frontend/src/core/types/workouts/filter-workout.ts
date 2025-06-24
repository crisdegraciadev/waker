import type { WorkoutType } from "./workout-type";

export type FilterWorkoutDto = {
  name: string | null;
  type: WorkoutType[];
};
