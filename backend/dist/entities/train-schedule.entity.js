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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainSchedule = void 0;
const typeorm_1 = require("typeorm");
const train_entity_1 = require("./train.entity");
const station_entity_1 = require("./station.entity");
const profile_entity_1 = require("./profile.entity");
let TrainSchedule = class TrainSchedule {
    id;
    trainId;
    train;
    departureStationId;
    departureStation;
    arrivalStationId;
    arrivalStation;
    departure_time;
    arrival_time;
    platform;
    status;
    delay_minutes;
    price;
    available_seats;
    createdBy;
    creator;
    createdAt;
    updatedAt;
};
exports.TrainSchedule = TrainSchedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TrainSchedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'train_id' }),
    __metadata("design:type", String)
], TrainSchedule.prototype, "trainId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => train_entity_1.Train),
    (0, typeorm_1.JoinColumn)({ name: 'train_id' }),
    __metadata("design:type", train_entity_1.Train)
], TrainSchedule.prototype, "train", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'departure_station_id' }),
    __metadata("design:type", String)
], TrainSchedule.prototype, "departureStationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => station_entity_1.Station),
    (0, typeorm_1.JoinColumn)({ name: 'departure_station_id' }),
    __metadata("design:type", station_entity_1.Station)
], TrainSchedule.prototype, "departureStation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'arrival_station_id' }),
    __metadata("design:type", String)
], TrainSchedule.prototype, "arrivalStationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => station_entity_1.Station),
    (0, typeorm_1.JoinColumn)({ name: 'arrival_station_id' }),
    __metadata("design:type", station_entity_1.Station)
], TrainSchedule.prototype, "arrivalStation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], TrainSchedule.prototype, "departure_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], TrainSchedule.prototype, "arrival_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TrainSchedule.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'scheduled' }),
    __metadata("design:type", String)
], TrainSchedule.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], TrainSchedule.prototype, "delay_minutes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], TrainSchedule.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], TrainSchedule.prototype, "available_seats", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], TrainSchedule.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => profile_entity_1.Profile),
    (0, typeorm_1.JoinColumn)({ name: 'created_by', referencedColumnName: 'id' }),
    __metadata("design:type", profile_entity_1.Profile)
], TrainSchedule.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], TrainSchedule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], TrainSchedule.prototype, "updatedAt", void 0);
exports.TrainSchedule = TrainSchedule = __decorate([
    (0, typeorm_1.Entity)('train_schedules')
], TrainSchedule);
//# sourceMappingURL=train-schedule.entity.js.map