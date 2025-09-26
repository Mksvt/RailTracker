import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from '../entities/profile.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() createProfileDto: Partial<Profile>) {
    return this.profileService.create(createProfileDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: Partial<Profile>) {
    return this.profileService.update(id, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(id);
  }
}
