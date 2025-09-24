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
    departure_time: string;
    arrival_time: string;
    platform: string;
    status: string;
    delay_minutes: number;
    price: number;
    available_seats: number;
    createdBy: string;
    creator: Profile;
    createdAt: Date;
    updatedAt: Date;
}
