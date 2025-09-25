import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TrainScheduleService } from './train-schedule.service';
import { CreateTrainScheduleDto } from './dto/create-train-schedule.dto';
import { TrainSchedule } from '../entities/train-schedule.entity';

@Controller('schedules')
export class TrainScheduleController {
  constructor(private readonly trainScheduleService: TrainScheduleService) {}

  @Post()
  create(@Body() createScheduleDto: CreateTrainScheduleDto) {
    return this.trainScheduleService.create(createScheduleDto);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ): Promise<TrainSchedule[]> {
    return this.trainScheduleService.findAll(search, sort);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainScheduleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: Partial<TrainSchedule>,
  ) {
    return this.trainScheduleService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainScheduleService.remove(id);
  }
}
