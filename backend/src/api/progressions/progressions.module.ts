import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ProgressionsController } from "./progressions.controller";
import { ProgressionsService } from "./progressions.service";
import { ActivitiesModule } from "../activities/activities.module";

@Module({
  imports: [AuthModule,ActivitiesModule],
  controllers: [ProgressionsController],
  providers: [ProgressionsService],
})
export class ProgressionsModule {}
