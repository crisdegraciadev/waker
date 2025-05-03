import * as request from "supertest";
import { App } from "supertest/types";
import { AuthEntity } from "~/api/auth/entities/auth.entity";
import { CreateUserDto } from "~/api/users/dtos/create-user.dto";

export default async function generateJwt(api: App, dto: CreateUserDto) {
  await request(api).post("/users").send(dto);

  const { body } = await request(api).post("/auth/login").send({
    email: dto.email,
    password: dto.password,
  });

  const { accessToken }: AuthEntity = body;

  return accessToken;
}
