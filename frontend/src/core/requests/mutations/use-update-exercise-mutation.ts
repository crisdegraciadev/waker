import { ApiRoutes } from "@/core/constants/api-routes";
import type { ErrorEntity } from "@/core/types/error/error.entity";
import type { Exercise } from "@/core/types/exercises/exercise";
import type { UpdateExerciseDto } from "@/core/types/exercises/update-exercise.dto";
import { useMutation, type MutationOptions } from "@tanstack/react-query";
import { request } from "../request";

function mutationFn(dto: UpdateExerciseDto) {
  return request({
    url: `${ApiRoutes.EXERCISES}/${dto.id}`,
    method: "patch",
    data: { ...dto },
  });
}

export function useUpdateExerciseMutation(mutationOptions?: MutationOptions<Exercise, ErrorEntity, UpdateExerciseDto>) {
  return useMutation({
    mutationFn,
    ...mutationOptions,
  });
}
