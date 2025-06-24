import { ApiRoutes } from "@/core/constants/api-routes";
import type { ErrorEntity } from "@/core/types/error/error.entity";
import type { CreateExerciseDto } from "@/core/types/exercises/create-exercise.dto";
import type { Exercise } from "@/core/types/exercises/exercise";
import { useMutation, type MutationOptions } from "@tanstack/react-query";
import { request } from "../../request";

function mutationFn(dto: CreateExerciseDto) {
  return request({
    url: ApiRoutes.EXERCISES,
    method: "post",
    data: { ...dto },
  });
}

export function useCreateExerciseMutation(mutationOptions?: MutationOptions<Exercise, ErrorEntity, CreateExerciseDto>) {
  return useMutation({
    mutationFn,
    ...mutationOptions,
  });
}
