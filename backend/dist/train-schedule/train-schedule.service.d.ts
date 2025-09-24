import { Repository } from 'typeorm';
import { TrainSchedule } from '../entities/train-schedule.entity';
export declare class TrainScheduleService {
    private trainSchedulesRepository;
    constructor(trainSchedulesRepository: Repository<TrainSchedule>);
    findAll(search?: string, sort?: string): Promise<TrainSchedule[]>;
    findOne(id: string): Promise<TrainSchedule | null>;
    create(schedule: Partial<TrainSchedule>): Promise<TrainSchedule>;
    update(id: string, schedule: Partial<TrainSchedule>): Promise<TrainSchedule | null>;
    remove(id: string): Promise<void>;
}
