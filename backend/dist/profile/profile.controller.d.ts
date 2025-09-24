import { ProfileService } from './profile.service';
import { Profile } from '../entities/profile.entity';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    create(createProfileDto: Partial<Profile>): Promise<Profile>;
    findAll(): Promise<Profile[]>;
    findOne(id: string): Promise<Profile | null>;
    update(id: string, updateProfileDto: Partial<Profile>): Promise<Profile | null>;
    remove(id: string): Promise<void>;
}
