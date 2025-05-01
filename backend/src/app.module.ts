import { Module } from "@nestjs/common";
import { UsersModule } from "./api/users/users.module";
import { DatabaseModule } from "./config/database/database.module";

@Module({
  imports: [DatabaseModule, UsersModule],
})
export class AppModule { }
