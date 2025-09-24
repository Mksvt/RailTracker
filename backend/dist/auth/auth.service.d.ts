import { JwtService } from '@nestjs/jwt';
import { ProfileService } from '../profile/profile.service';
export declare class AuthService {
    private profileService;
    private jwtService;
    constructor(profileService: ProfileService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    register(user: any): Promise<{
        access_token: string;
    }>;
}
