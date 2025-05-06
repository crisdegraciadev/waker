import { Module } from '@nestjs/common';
import { WorkoutProgressionsService } from './workout-progressions.service';
import { WorkoutProgressionsController } from './workout-progressions.controller';

@Module({
  controllers: [WorkoutProgressionsController],
  providers: [WorkoutProgressionsService],
})
export class WorkoutProgressionsModule {}
