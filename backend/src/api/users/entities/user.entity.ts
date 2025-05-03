import { User } from "@prisma/client";
import { Exclude } from "class-transformer";

export class UserEntity implements User {
  id: number;

  email: string;

  @Exclude()
  passwordHash: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
