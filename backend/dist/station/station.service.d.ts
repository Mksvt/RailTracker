import { Repository } from 'typeorm';
import { Station } from '../entities/station.entity';
import { TrainSchedule } from '../entities/train-schedule.entity';
export declare class StationService {
    private stationsRepository;
    private trainSchedulesRepository;
    constructor(stationsRepository: Repository<Station>, trainSchedulesRepository: Repository<TrainSchedule>);
    findAll(): Promise<Station[]>;
    findOne(id: string): Promise<Station | null>;
    create(station: Partial<Station>): Promise<Station>;
    update(id: string, station: Partial<Station>): Promise<Station | null>;
    remove(id: string): Promise<void>;
}
