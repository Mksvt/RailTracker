import { TrainScheduleService } from './train-schedule.service';
import { CreateTrainScheduleDto } from './dto/create-train-schedule.dto';
import { TrainSchedule } from '../entities/train-schedule.entity';
export declare class TrainScheduleController {
    private readonly trainScheduleService;
    constructor(trainScheduleService: TrainScheduleService);
    create(createScheduleDto: CreateTrainScheduleDto): Promise<TrainSchedule>;
    findAll(search?: string, sort?: string): Promise<TrainSchedule[]>;
    findOne(id: string): Promise<TrainSchedule | null>;
    update(id: string, updateScheduleDto: Partial<TrainSchedule>): Promise<TrainSchedule | null>;
    remove(id: string): Promise<void>;
}
