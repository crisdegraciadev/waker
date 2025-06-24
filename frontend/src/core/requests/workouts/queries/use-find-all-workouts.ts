import { ApiRoutes } from "@/core/constants/api-routes";
import { request } from "../../request";
import type { PageQueryParams } from "@/core/types/utils/query";
import type { FilterWorkoutDto } from "@/core/types/workouts/filter-workout";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/core/constants/query-keys";

function queryFn({ page, limit }: PageQueryParams, filters?: FilterWorkoutDto) {
  return request({
    url: ApiRoutes.WORKOUTS,
    method: "get",
    params: { page, limit, ...filters },
  });
}

export function useFindAllWorkoutsQuery(params: PageQueryParams, filters?: FilterWorkoutDto) {
  return useQuery({
    queryKey: [...QueryKeys.Workouts.FIND_ALL, params.page, params.limit, filters],
    queryFn: () => queryFn(params, filters),
  });
}
