import { TrainService } from './train.service';
import { Train } from '../entities/train.entity';
export declare class TrainController {
    private readonly trainService;
    constructor(trainService: TrainService);
    create(createTrainDto: Partial<Train>): Promise<Train>;
    findAll(): Promise<Train[]>;
    findOne(id: string): Promise<Train | null>;
    update(id: string, updateTrainDto: Partial<Train>): Promise<Train | null>;
    remove(id: string): Promise<void>;
}
