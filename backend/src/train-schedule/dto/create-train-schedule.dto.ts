import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsOptional,
  IsNumber,
  IsIn,
} from 'class-validator';

export class CreateTrainScheduleDto {
  @IsUUID()
  @IsNotEmpty()
  trainId: string;

  @IsUUID()
  @IsNotEmpty()
  departureStationId: string;

  @IsUUID()
  @IsNotEmpty()
  arrivalStationId: string;

  @IsDateString()
  @IsNotEmpty()
  departureTime: string;

  @IsDateString()
  @IsNotEmpty()
  arrivalTime: string;

  @IsString()
  @IsOptional()
  platform?: string;

  @IsString()
  @IsOptional()
  @IsIn(['on-time', 'delayed', 'cancelled'])
  status?: string = 'on-time';

  @IsNumber()
  @IsOptional()
  delayMinutes?: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  availableSeats: number;
}
