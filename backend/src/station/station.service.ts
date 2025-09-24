import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from '../entities/station.entity';

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station)
    private stationsRepository: Repository<Station>,
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
    await this.stationsRepository.delete(id);
  }
}
