import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { WorkoutProgressionsController } from "./workout-progressions.controller";
import { WorkoutProgressionsService } from "./workout-progressions.service";

@Module({
  imports: [AuthModule],
  controllers: [WorkoutProgressionsController],
  providers: [WorkoutProgressionsService],
})
export class WorkoutProgressionsModule {}
