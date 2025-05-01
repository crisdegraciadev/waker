import { User } from "@prisma/client";
import { Exclude } from "class-transformer";

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  id: number;

  email: string;

  @Exclude()
  password_hash: string;
}
