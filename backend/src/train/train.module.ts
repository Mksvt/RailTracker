import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Train } from '../entities/train.entity';
import { TrainSchedule } from '../entities/train-schedule.entity';
import { TrainService } from './train.service';
import { TrainController } from './train.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Train, TrainSchedule])],
  providers: [TrainService],
  controllers: [TrainController],
})
export class TrainModule {}
