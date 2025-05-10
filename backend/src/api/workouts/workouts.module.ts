import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { WorkoutsController } from "./workouts.controller";
import { WorkoutsService } from "./workouts.service";

@Module({
  imports: [AuthModule],
  controllers: [WorkoutsController],
  providers: [WorkoutsService ],
})
export class WorkoutsModule {}
