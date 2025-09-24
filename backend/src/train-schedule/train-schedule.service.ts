import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { TrainSchedule } from '../entities/train-schedule.entity';

@Injectable()
export class TrainScheduleService {
  constructor(
    @InjectRepository(TrainSchedule)
    private trainSchedulesRepository: Repository<TrainSchedule>,
  ) {}

  findAll(search?: string, sort?: string): Promise<TrainSchedule[]> {
    const options: FindManyOptions<TrainSchedule> = {
      relations: ['train', 'departureStation', 'arrivalStation'],
    };

    if (search) {
      options.where = [
        { departureStation: { name: `%${search}%` } },
        { arrivalStation: { name: `%${search}%` } },
      ];
    }

    if (sort) {
      options.order = { [sort]: 'ASC' };
    }

    return this.trainSchedulesRepository.find(options);
  }

  findOne(id: string): Promise<TrainSchedule | null> {
    return this.trainSchedulesRepository.findOne({
      where: { id },
      relations: ['train', 'departureStation', 'arrivalStation'],
    });
  }

  create(schedule: Partial<TrainSchedule>): Promise<TrainSchedule> {
    const newSchedule = this.trainSchedulesRepository.create(schedule);
    return this.trainSchedulesRepository.save(newSchedule);
  }

  async update(
    id: string,
    schedule: Partial<TrainSchedule>,
  ): Promise<TrainSchedule | null> {
    await this.trainSchedulesRepository.update(id, schedule);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.trainSchedulesRepository.delete(id);
  }
}
