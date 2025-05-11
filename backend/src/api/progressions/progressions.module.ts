import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ProgressionsController } from "./progressions.controller";
import { ProgressionsService } from "./progressions.service";

@Module({
  imports: [AuthModule],
  controllers: [ProgressionsController],
  providers: [ProgressionsService],
})
export class ProgressionsModule {}
