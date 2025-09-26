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
exports.TrainService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const train_entity_1 = require("../entities/train.entity");
const train_schedule_entity_1 = require("../entities/train-schedule.entity");
let TrainService = class TrainService {
    trainsRepository;
    trainSchedulesRepository;
    constructor(trainsRepository, trainSchedulesRepository) {
        this.trainsRepository = trainsRepository;
        this.trainSchedulesRepository = trainSchedulesRepository;
    }
    findAll() {
        return this.trainsRepository.find();
    }
    findOne(id) {
        return this.trainsRepository.findOneBy({ id });
    }
    create(train) {
        const newTrain = this.trainsRepository.create(train);
        return this.trainsRepository.save(newTrain);
    }
    async update(id, train) {
        await this.trainsRepository.update(id, train);
        return this.trainsRepository.findOneBy({ id });
    }
    async remove(id) {
        const schedulesCount = await this.trainSchedulesRepository.count({
            where: { trainId: id },
        });
        if (schedulesCount > 0) {
            throw new common_1.BadRequestException(`Неможливо видалити поїзд. Він використовується в ${schedulesCount} розкладах. Спочатку видаліть всі пов'язані розклади.`);
        }
        await this.trainsRepository.delete(id);
    }
};
exports.TrainService = TrainService;
exports.TrainService = TrainService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(train_entity_1.Train)),
    __param(1, (0, typeorm_1.InjectRepository)(train_schedule_entity_1.TrainSchedule)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TrainService);
//# sourceMappingURL=train.service.js.map