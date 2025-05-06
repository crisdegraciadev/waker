import { Module } from "@nestjs/common";
import { WorkoutsService } from "./workouts.service";
import { WorkoutsController } from "./workouts.controller";
import { DatabaseService } from "~/shared/database.service";
import { PaginationService } from "~/shared/pagination.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [WorkoutsController],
  providers: [WorkoutsService, DatabaseService, PaginationService],
})
export class WorkoutsModule {}
