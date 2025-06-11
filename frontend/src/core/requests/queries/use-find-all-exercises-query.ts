import { useQuery } from "@tanstack/react-query";
import { request } from "../request";
import { ApiRoutes } from "@/core/constants/api-routes";
import { QueryKeys } from "@/core/constants/query-keys";
import type { PageQueryParams } from "@/core/types/utils/query";
import type { FindAllExercisesFilterDto } from "@/core/types/exercises/find-all-exercises-filter.dto";

function queryFn({ page, limit }: PageQueryParams, filters?: FindAllExercisesFilterDto) {
  return request({
    url: ApiRoutes.EXERCISES,
    method: "get",
    params: { page, limit, ...filters },
  });
}

export function useFindAllExercisesQuery(params: PageQueryParams, filters?: FindAllExercisesFilterDto) {
  return useQuery({
    queryKey: [...QueryKeys.Exercises.FIND_ALL, params.page, params.limit],
    queryFn: () => queryFn(params, filters),
  });
}
