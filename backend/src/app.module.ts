import { Module } from "@nestjs/common";
import { AuthModule } from "./api/auth/auth.module";
import { ExercisesModule } from "./api/exercises/exercises.module";
import { ProgressionsModule } from "./api/progressions/progressions.module";
import { UsersModule } from "./api/users/users.module";
import { WorkoutsModule } from "./api/workouts/workouts.module";
import { SharedModule } from "./shared/shared.module";

@Module({
  imports: [SharedModule, UsersModule, AuthModule, WorkoutsModule, ProgressionsModule, ExercisesModule, SharedModule],
})
export class AppModule {}
