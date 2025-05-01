import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import { DatabaseService } from "../../config/database/database.service";

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

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.db.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("user not found");
    }

    return new UserEntity(user);
  }
}
