import { ApiRoutes } from "@/core/constants/api-routes";
import type { ErrorEntity } from "@/core/types/error/error.entity";
import type { UpdateWorkoutDto } from "@/core/types/workouts/update-workout";
import type { Workout } from "@/core/types/workouts/workouts";
import { useMutation, type MutationOptions } from "@tanstack/react-query";
import { request } from "../../request";

function mutationFn(dto: UpdateWorkoutDto) {
  return request({
    url: `${ApiRoutes.WORKOUTS}/${dto.id}`,
    method: "patch",
    data: { ...dto },
  });
}

export function useUpdateWorkoutMutation(mutationOptions?: MutationOptions<Workout, ErrorEntity, UpdateWorkoutDto>) {
  return useMutation({
    mutationFn,
    ...mutationOptions,
  });
}
