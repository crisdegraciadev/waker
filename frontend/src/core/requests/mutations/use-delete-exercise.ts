import { ApiRoutes } from "@/core/constants/api-routes";
import type { ErrorEntity } from "@/core/types/error/error.entity";
import { useMutation, type MutationOptions } from "@tanstack/react-query";
import { request } from "../request";

function mutationFn(id: number) {
  return request({
    url: `${ApiRoutes.EXERCISES}/${id}`,
    method: "delete",
  });
}

export function useDeleteExerciseMutation(mutationOptions?: MutationOptions<void, ErrorEntity, number>) {
  return useMutation({
    mutationFn,
    ...mutationOptions,
  });
}
