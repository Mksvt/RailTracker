import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Train } from './train.entity';
import { Station } from './station.entity';
import { Profile } from './profile.entity';

@Entity('train_schedules')
export class TrainSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'train_id' })
  trainId: string;

  @ManyToOne(() => Train)
  @JoinColumn({ name: 'train_id' })
  train: Train;

  @Column({ name: 'departure_station_id' })
  departureStationId: string;

  @ManyToOne(() => Station)
  @JoinColumn({ name: 'departure_station_id' })
  departureStation: Station;

  @Column({ name: 'arrival_station_id' })
  arrivalStationId: string;

  @ManyToOne(() => Station)
  @JoinColumn({ name: 'arrival_station_id' })
  arrivalStation: Station;

  @Column({ type: 'time' })
  departure_time: string;

  @Column({ type: 'time' })
  arrival_time: string;

  @Column({ type: 'text', nullable: true })
  platform: string;

  @Column({ type: 'text', default: 'scheduled' })
  status: string;

  @Column({ type: 'integer', default: 0 })
  delay_minutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'integer', default: 0 })
  available_seats: number;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator: Profile;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
