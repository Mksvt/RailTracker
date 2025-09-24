import { StationService } from './station.service';
import { Station } from '../entities/station.entity';
export declare class StationController {
    private readonly stationService;
    constructor(stationService: StationService);
    create(createStationDto: Partial<Station>): Promise<Station>;
    findAll(): Promise<Station[]>;
    findOne(id: string): Promise<Station | null>;
    update(id: string, updateStationDto: Partial<Station>): Promise<Station | null>;
    remove(id: string): Promise<void>;
}
