import { Repository } from 'typeorm';
import { Train } from '../entities/train.entity';
export declare class TrainService {
    private trainsRepository;
    constructor(trainsRepository: Repository<Train>);
    findAll(): Promise<Train[]>;
    findOne(id: string): Promise<Train | null>;
    create(train: Partial<Train>): Promise<Train>;
    update(id: string, train: Partial<Train>): Promise<Train | null>;
    remove(id: string): Promise<void>;
}
