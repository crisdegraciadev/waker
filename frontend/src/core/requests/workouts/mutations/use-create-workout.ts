import type { CreateWorkoutDto } from "@/core/types/workouts/create-workout";
import { request } from "../../request";
import { ApiRoutes } from "@/core/constants/api-routes";
import { useMutation, type MutationOptions } from "@tanstack/react-query";
import type { Workout } from "@/core/types/workouts/workouts";
import type { ErrorEntity } from "@/core/types/error/error.entity";

function mutationFn(dto: CreateWorkoutDto) {
  return request({
    url: ApiRoutes.WORKOUTS,
    method: "post",
    data: { ...dto },
  });
}

export function useCreateWorkoutMutation(mutationOptions?: MutationOptions<Workout, ErrorEntity, CreateWorkoutDto>) {
  return useMutation({
    mutationFn,
    ...mutationOptions,
  });
}
