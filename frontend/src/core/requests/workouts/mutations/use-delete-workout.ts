import { ApiRoutes } from "@/core/constants/api-routes";
import { request } from "../../request";
import { useMutation, type MutationOptions } from "@tanstack/react-query";
import type { ErrorEntity } from "@/core/types/error/error.entity";

function mutationFn(id: number) {
  return request({
    url: `${ApiRoutes.WORKOUTS}/${id}`,
    method: "delete",
  });
}

export function useDeleteWorkoutMutation(mutationOptions?: MutationOptions<void, ErrorEntity, number>) {
  return useMutation({
    mutationFn,
    ...mutationOptions,
  });
}
