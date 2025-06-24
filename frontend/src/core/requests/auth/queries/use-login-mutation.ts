import { ApiRoutes } from "@/core/constants/api-routes";
import type { LoginDto } from "@/core/types/auth/login.dto";
import type { TokenEntity } from "@/core/types/auth/token.entity";
import type { ErrorEntity } from "@/core/types/error/error.entity";
import {
  useMutation,
  type MutationOptions
} from "@tanstack/react-query";
import { request } from "../../request";

function mutationFn(credentials: LoginDto) {
  return request({
    url: ApiRoutes.LOGIN,
    method: "post",
    data: { ...credentials },
  });
}

export function useLoginMutation(
  mutationOptions?: MutationOptions<TokenEntity, ErrorEntity, LoginDto>,
) {
  return useMutation({
    mutationFn,
    ...mutationOptions,
  });
}
