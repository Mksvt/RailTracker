"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const profile_entity_1 = require("../entities/profile.entity");
let ProfileService = class ProfileService {
    profilesRepository;
    constructor(profilesRepository) {
        this.profilesRepository = profilesRepository;
    }
    findAll() {
        return this.profilesRepository.find();
    }
    findOne(id) {
        return this.profilesRepository.findOneBy({ id });
    }
    findByEmail(email) {
        return this.profilesRepository
            .createQueryBuilder('profile')
            .where('profile.email = :email', { email })
            .addSelect('profile.password')
            .getOne();
    }
    async create(profile) {
        const newProfile = this.profilesRepository.create(profile);
        return this.profilesRepository.save(newProfile);
    }
    async update(id, profile) {
        await this.profilesRepository.update(id, profile);
        return this.profilesRepository.findOneBy({ id });
    }
    async remove(id) {
        await this.profilesRepository.delete(id);
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(profile_entity_1.Profile)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProfileService);
//# sourceMappingURL=profile.service.js.map