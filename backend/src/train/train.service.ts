import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Train } from '../entities/train.entity';

@Injectable()
export class TrainService {
  constructor(
    @InjectRepository(Train)
    private trainsRepository: Repository<Train>,
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
    await this.trainsRepository.delete(id);
  }
}
