import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthEntity } from "./entities/auth.entity";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dtos/login.dto";
import { DatabaseService } from "../../shared/database.service";

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
  ) { }

  async login({ email, password }: LoginDto): Promise<AuthEntity> {
    const user = await this.db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`user not found for email: ${email}`);
    }

    const { passwordHash } = user;

    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException("invalid password");
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }
}
