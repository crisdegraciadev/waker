import { Module } from "@nestjs/common";
import { UsersModule } from "./api/users/users.module";
import { DatabaseModule } from "./config/database/database.module";
import { AuthModule } from "./api/auth/auth.module";
import { ExercisesModule } from "./api/exercises/exercises.module";

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, ExercisesModule],
})
export class AppModule {}
