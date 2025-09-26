import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like } from 'typeorm';
import { TrainSchedule } from '../entities/train-schedule.entity';
import { CreateTrainScheduleDto } from './dto/create-train-schedule.dto';

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
        { departureStation: { name: Like(`%${search}%`) } },
        { arrivalStation: { name: Like(`%${search}%`) } },
        { train: { number: Like(`%${search}%`) } },
        { train: { name: Like(`%${search}%`) } },
      ];
    }

    if (sort) {
      const sortKey = sort.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      options.order = { [sortKey]: 'ASC' };
    }

    return this.trainSchedulesRepository.find(options);
  }

  findOne(id: string): Promise<TrainSchedule | null> {
    return this.trainSchedulesRepository.findOne({
      where: { id },
      relations: ['train', 'departureStation', 'arrivalStation'],
    });
  }

  create(createScheduleDto: CreateTrainScheduleDto): Promise<TrainSchedule> {
    const { trainId, departureStationId, arrivalStationId, ...scheduleData } =
      createScheduleDto;

    const newSchedule = this.trainSchedulesRepository.create({
      ...scheduleData,
      train: { id: trainId },
      departureStation: { id: departureStationId },
      arrivalStation: { id: arrivalStationId },
    });
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
