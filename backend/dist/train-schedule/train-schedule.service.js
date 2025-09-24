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
exports.TrainScheduleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const train_schedule_entity_1 = require("../entities/train-schedule.entity");
let TrainScheduleService = class TrainScheduleService {
    trainSchedulesRepository;
    constructor(trainSchedulesRepository) {
        this.trainSchedulesRepository = trainSchedulesRepository;
    }
    findAll(search, sort) {
        const options = {
            relations: ['train', 'departureStation', 'arrivalStation'],
        };
        if (search) {
            options.where = [
                { departureStation: { name: `%${search}%` } },
                { arrivalStation: { name: `%${search}%` } },
            ];
        }
        if (sort) {
            options.order = { [sort]: 'ASC' };
        }
        return this.trainSchedulesRepository.find(options);
    }
    findOne(id) {
        return this.trainSchedulesRepository.findOne({
            where: { id },
            relations: ['train', 'departureStation', 'arrivalStation'],
        });
    }
    create(schedule) {
        const newSchedule = this.trainSchedulesRepository.create(schedule);
        return this.trainSchedulesRepository.save(newSchedule);
    }
    async update(id, schedule) {
        await this.trainSchedulesRepository.update(id, schedule);
        return this.findOne(id);
    }
    async remove(id) {
        await this.trainSchedulesRepository.delete(id);
    }
};
exports.TrainScheduleService = TrainScheduleService;
exports.TrainScheduleService = TrainScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(train_schedule_entity_1.TrainSchedule)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TrainScheduleService);
//# sourceMappingURL=train-schedule.service.js.map