import * as request from "supertest";
import { App } from "supertest/types";

export default function authenticatedRequest(api: App, token: string) {
  return {
    get: (url: string) => request(api).get(url).set("Authorization", `Bearer ${token}`),
    post: (url: string) => request(api).post(url).set("Authorization", `Bearer ${token}`),
    patch: (url: string) => request(api).patch(url).set("Authorization", `Bearer ${token}`),
    delete: (url: string) => request(api).delete(url).set("Authorization", `Bearer ${token}`),
  };
}
