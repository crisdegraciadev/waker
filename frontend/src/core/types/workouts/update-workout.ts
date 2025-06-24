import type { CreateWorkoutDto } from "./create-workout";

export type UpdateWorkoutDto = Partial<CreateWorkoutDto> & { id: number };
