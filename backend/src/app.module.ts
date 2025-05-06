import { Module } from "@nestjs/common";
import { UsersModule } from "./api/users/users.module";
import { AuthModule } from "./api/auth/auth.module";
import { ExercisesModule } from "./api/exercises/exercises.module";
import { SharedModule } from "./shared/shared.module";
import { WorkoutsModule } from "./api/workouts/workouts.module";

@Module({
  imports: [SharedModule, UsersModule, AuthModule, WorkoutsModule, ExercisesModule, SharedModule],
})
export class AppModule {}
