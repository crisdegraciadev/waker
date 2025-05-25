import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { axiosClient } from "./client";
import type { ErrorEntity } from "../types/error/error.entity";

export const request = async (options: AxiosRequestConfig) => {
  const onSuccess = (response: AxiosResponse) => {
    return response.data;
  };

  const onError = function(e: AxiosError<ErrorEntity>) {
    if (e.response?.data) {
      const { error, message, statusCode } = e.response.data;

      return Promise.reject({
        error,
        message,
        statusCode,
      });
    }
  };

  return axiosClient(options).then(onSuccess).catch(onError);
};
