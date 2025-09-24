import { TrainScheduleService } from './train-schedule.service';
import { TrainSchedule } from '../entities/train-schedule.entity';
export declare class TrainScheduleController {
    private readonly trainScheduleService;
    constructor(trainScheduleService: TrainScheduleService);
    create(createScheduleDto: Partial<TrainSchedule>): Promise<TrainSchedule>;
    findAll(search?: string, sort?: string): Promise<TrainSchedule[]>;
    findOne(id: string): Promise<TrainSchedule | null>;
    update(id: string, updateScheduleDto: Partial<TrainSchedule>): Promise<TrainSchedule | null>;
    remove(id: string): Promise<void>;
}
