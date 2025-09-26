import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Train } from '../entities/train.entity';
import { TrainSchedule } from '../entities/train-schedule.entity';

@Injectable()
export class TrainService {
  constructor(
    @InjectRepository(Train)
    private trainsRepository: Repository<Train>,
    @InjectRepository(TrainSchedule)
    private trainSchedulesRepository: Repository<TrainSchedule>,
  ) {}

  findAll(): Promise<Train[]> {
    return this.trainsRepository.find();
  }

  findOne(id: string): Promise<Train | null> {
    return this.trainsRepository.findOneBy({ id });
  }

  create(train: Partial<Train>): Promise<Train> {
    const newTrain = this.trainsRepository.create(train);
    return this.trainsRepository.save(newTrain);
  }

  async update(id: string, train: Partial<Train>): Promise<Train | null> {
    await this.trainsRepository.update(id, train);
    return this.trainsRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    // Check if train is used in any schedules
    const schedulesCount = await this.trainSchedulesRepository.count({
      where: { trainId: id },
    });

    if (schedulesCount > 0) {
      throw new BadRequestException(
        `Неможливо видалити поїзд. Він використовується в ${schedulesCount} розкладах. Спочатку видаліть всі пов'язані розклади.`,
      );
    }

    await this.trainsRepository.delete(id);
  }
}
