"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainScheduleModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const train_schedule_entity_1 = require("../entities/train-schedule.entity");
const train_schedule_service_1 = require("./train-schedule.service");
const train_schedule_controller_1 = require("./train-schedule.controller");
let TrainScheduleModule = class TrainScheduleModule {
};
exports.TrainScheduleModule = TrainScheduleModule;
exports.TrainScheduleModule = TrainScheduleModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([train_schedule_entity_1.TrainSchedule])],
        providers: [train_schedule_service_1.TrainScheduleService],
        controllers: [train_schedule_controller_1.TrainScheduleController],
    })
], TrainScheduleModule);
//# sourceMappingURL=train-schedule.module.js.map