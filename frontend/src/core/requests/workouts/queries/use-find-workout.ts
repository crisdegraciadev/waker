import { ApiRoutes } from "@/core/constants/api-routes";
import { request } from "../../request";
import { QueryKeys } from "@/core/constants/query-keys";
import { useQuery } from "@tanstack/react-query";
import type { Workout } from "@/core/types/workouts/workouts";

function queryFn(id: number): Promise<Workout> {
  return request({
    url: `${ApiRoutes.WORKOUTS}/${id}`,
    method: "get",
  });
}

export function useFindWorkoutQuery(id: number) {
  return useQuery({
    queryKey: [...QueryKeys.Workouts.FIND, id],
    queryFn: () => queryFn(id),
  });
}
