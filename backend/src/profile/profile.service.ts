import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';

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
    const newProfile = this.profilesRepository.create(profile);
    return this.profilesRepository.save(newProfile);
  }

  async update(id: string, profile: Partial<Profile>): Promise<Profile | null> {
    await this.profilesRepository.update(id, profile);
    return this.profilesRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.profilesRepository.delete(id);
  }
}