import { Repository } from 'typeorm';
import { Station } from '../entities/station.entity';
export declare class StationService {
    private stationsRepository;
    constructor(stationsRepository: Repository<Station>);
    findAll(): Promise<Station[]>;
    findOne(id: string): Promise<Station | null>;
    create(station: Partial<Station>): Promise<Station>;
    update(id: string, station: Partial<Station>): Promise<Station | null>;
    remove(id: string): Promise<void>;
}
