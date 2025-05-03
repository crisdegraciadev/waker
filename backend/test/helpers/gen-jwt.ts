import * as request from "supertest";
import { App } from "supertest/types";
import { AuthEntity } from "~/api/auth/entity/auth.entity";

export default async function genJwt(api: App): Promise<string> {
  const userDto = {
    email: "test@email.com",
    password: "123456789",
    confirmPassword: "123456789",
  };

  await request(api).post("/users").send(userDto);

  const { body } = await request(api).post("/auth/login").send({
    email: userDto.email,
    password: userDto.password,
  });

  const { accessToken }: AuthEntity = body;

  return accessToken;
}
