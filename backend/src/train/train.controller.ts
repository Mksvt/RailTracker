import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TrainService } from './train.service';
import { Train } from '../entities/train.entity';

@Controller('trains')
export class TrainController {
  constructor(private readonly trainService: TrainService) {}

  @Post()
  create(@Body() createTrainDto: Partial<Train>) {
    return this.trainService.create(createTrainDto);
  }

  @Get()
  findAll() {
    return this.trainService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrainDto: Partial<Train>) {
    return this.trainService.update(id, updateTrainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainService.remove(id);
  }
}
