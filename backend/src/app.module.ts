import { Module } from "@nestjs/common";
import { UsersModule } from "./api/users/users.module";
import { DatabaseModule } from "./config/database/database.module";
import { AuthModule } from "./api/auth/auth.module";

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule],
})
export class AppModule { }
