import { Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';
export declare class ProfileService {
    private profilesRepository;
    constructor(profilesRepository: Repository<Profile>);
    findAll(): Promise<Profile[]>;
    findOne(id: string): Promise<Profile | null>;
    findByEmail(email: string): Promise<Profile | null>;
    create(profile: Partial<Profile>): Promise<Profile>;
    update(id: string, profile: Partial<Profile>): Promise<Profile | null>;
    remove(id: string): Promise<void>;
}
