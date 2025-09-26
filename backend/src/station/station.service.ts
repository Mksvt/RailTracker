import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from '../entities/station.entity';
import { TrainSchedule } from '../entities/train-schedule.entity';

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station)
    private stationsRepository: Repository<Station>,
    @InjectRepository(TrainSchedule)
    private trainSchedulesRepository: Repository<TrainSchedule>,
  ) {}

  findAll(): Promise<Station[]> {
    return this.stationsRepository.find();
  }

  findOne(id: string): Promise<Station | null> {
    return this.stationsRepository.findOneBy({ id });
  }

  create(station: Partial<Station>): Promise<Station> {
    const newStation = this.stationsRepository.create(station);
    return this.stationsRepository.save(newStation);
  }

  async update(id: string, station: Partial<Station>): Promise<Station | null> {
    await this.stationsRepository.update(id, station);
    return this.stationsRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    // Check if station is used in any schedules
    const schedulesCount = await this.trainSchedulesRepository.count({
      where: [{ departureStationId: id }, { arrivalStationId: id }],
    });

    if (schedulesCount > 0) {
      throw new BadRequestException(
        `Неможливо видалити станцію. Вона використовується в ${schedulesCount} розкладах поїздів. Спочатку видаліть всі пов'язані розклади.`,
      );
    }

    await this.stationsRepository.delete(id);
  }
}
