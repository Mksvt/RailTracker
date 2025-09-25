import { Train } from './train.entity';
import { Station } from './station.entity';
import { Profile } from './profile.entity';
export declare class TrainSchedule {
    id: string;
    trainId: string;
    train: Train;
    departureStationId: string;
    departureStation: Station;
    arrivalStationId: string;
    arrivalStation: Station;
    departureTime: Date;
    arrivalTime: Date;
    platform: string;
    status: string;
    delayMinutes: number;
    price: number;
    availableSeats: number;
    createdBy: string;
    creator: Profile;
    createdAt: Date;
    updatedAt: Date;
}
