import { useQuery } from "@tanstack/react-query";
import { request } from "../request";
import { ApiRoutes } from "@/core/constants/api-routes";
import { QueryKeys } from "@/core/constants/query-keys";
import type { PageQueryParams } from "@/core/types/utils/query";

function queryFn({ page, limit }: PageQueryParams) {
  return request({
    url: ApiRoutes.EXERCISES,
    method: "get",
    params: { page, limit },
  });
}

export function useFindAllExercisesQuery(params: PageQueryParams) {
  return useQuery({
    queryKey: [...QueryKeys.Exercises.FIND_ALL, params.page, params.limit],
    queryFn: () => queryFn(params),
  });
}
