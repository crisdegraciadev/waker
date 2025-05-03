import { Module } from "@nestjs/common";
import { UsersModule } from "./api/users/users.module";
import { AuthModule } from "./api/auth/auth.module";
import { ExercisesModule } from "./api/exercises/exercises.module";
import { SharedModule } from "./shared/shared.module";

@Module({
  imports: [SharedModule, UsersModule, AuthModule, ExercisesModule, SharedModule],
})
export class AppModule { }
