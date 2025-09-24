import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Train } from '../entities/train.entity';
import { TrainService } from './train.service';
import { TrainController } from './train.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Train])],
  providers: [TrainService],
  controllers: [TrainController],
})
export class TrainModule {}
