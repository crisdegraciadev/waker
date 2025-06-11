import { useQuery } from "@tanstack/react-query";
import { request } from "../request";
import { ApiRoutes } from "@/core/constants/api-routes";
import { QueryKeys } from "@/core/constants/query-keys";
import type { PageQueryParams } from "@/core/types/utils/query";
import type { FilterExerciseDto } from "@/core/types/exercises/filter-exercise.dto";

function queryFn({ page, limit }: PageQueryParams, filters?: FilterExerciseDto) {
  console.log({ filters });
  return request({
    url: ApiRoutes.EXERCISES,
    method: "get",
    params: { page, limit, ...filters },
  });
}

export function useFindAllExercisesQuery(params: PageQueryParams, filters?: FilterExerciseDto) {
  return useQuery({
    queryKey: [...QueryKeys.Exercises.FIND_ALL, params.page, params.limit, filters],
    queryFn: () => queryFn(params, filters),
  });
}
