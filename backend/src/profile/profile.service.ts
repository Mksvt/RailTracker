import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  findAll(): Promise<Profile[]> {
    return this.profilesRepository.find();
  }

  findOne(id: string): Promise<Profile | null> {
    return this.profilesRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<Profile | null> {
    return this.profilesRepository
      .createQueryBuilder('profile')
      .where('profile.email = :email', { email })
      .addSelect('profile.password')
      .getOne();
  }

  async create(profile: Partial<Profile>): Promise<Profile> {
    // Пароль должен быть захэширован перед сохранением
    if (profile.password) {
      const salt = await bcrypt.genSalt();
      profile.password = await bcrypt.hash(profile.password, salt);
    }
    const newProfile = this.profilesRepository.create(profile);
    return this.profilesRepository.save(newProfile);
  }

  async update(id: string, profile: Partial<Profile>): Promise<Profile | null> {
    if (profile.password) {
      const salt = await bcrypt.genSalt();
      profile.password = await bcrypt.hash(profile.password, salt);
    }
    await this.profilesRepository.update(id, profile);
    return this.profilesRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.profilesRepository.delete(id);
  }
}
