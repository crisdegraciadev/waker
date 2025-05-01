import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/config/database/database.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) { }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, password } = createUserDto;

    const roundsOfHashing = 10;
    const passwordHash = await bcrypt.hash(password, roundsOfHashing);

    const user = await this.db.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    return new UserEntity(user);
  }
}
