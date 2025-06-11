import type { CreateExerciseDto } from "./create-exercise.dto";

export type UpdateExerciseDto = Partial<CreateExerciseDto> & { id: number };
