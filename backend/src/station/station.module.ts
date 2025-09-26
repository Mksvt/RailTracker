import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Station } from '../entities/station.entity';
import { TrainSchedule } from '../entities/train-schedule.entity';
import { StationService } from './station.service';
import { StationController } from './station.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Station, TrainSchedule])],
  providers: [StationService],
  controllers: [StationController],
})
export class StationModule {}
