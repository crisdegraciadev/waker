import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../../config/database/database.module';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [ExercisesController],
  providers: [ExercisesService],
})
export class ExercisesModule {}
