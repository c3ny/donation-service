import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum RegistrationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export class CreateRegistrationDto {
  @ApiProperty({
    description: 'ID of the donation request',
    example: '67123abc456def789012',
    format: 'uuid',
  })
  @IsString()
  donationId: string;

  @ApiProperty({
    description: 'ID of the user registering to donate',
    example: '50f05b0c-5ce0-4920-9960-11f733f713a7',
    format: 'uuid',
  })
  @IsString()
  userId: string;

  @ApiPropertyOptional({
    description: 'Additional notes from the donor',
    example: 'Available to donate on weekday mornings',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateRegistrationStatusDto {
  @ApiProperty({
    description: 'New registration status',
    enum: RegistrationStatus,
    example: RegistrationStatus.CONFIRMED,
  })
  @IsEnum(RegistrationStatus)
  status: RegistrationStatus;
}

export class RegistrationResponseDto {
  @ApiProperty({
    description: 'Registration unique identifier',
    example: 'reg789xyz123',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the donation request',
    example: '67123abc456def789012',
    format: 'uuid',
  })
  donationId: string;

  @ApiProperty({
    description: 'ID of the user who registered',
    example: '50f05b0c-5ce0-4920-9960-11f733f713a7',
    format: 'uuid',
  })
  userId: string;

  @ApiProperty({
    description: 'Current registration status',
    enum: RegistrationStatus,
    example: RegistrationStatus.PENDING,
  })
  status: RegistrationStatus;

  @ApiProperty({
    description: 'When the user registered',
    example: '2025-10-17T14:30:00.000Z',
    format: 'date-time',
  })
  registeredAt: string;

  @ApiPropertyOptional({
    description: 'When the registration was confirmed',
    example: '2025-10-17T15:00:00.000Z',
    format: 'date-time',
  })
  confirmedAt?: string;

  @ApiPropertyOptional({
    description: 'When the donation was completed',
    example: '2025-10-18T10:00:00.000Z',
    format: 'date-time',
  })
  completedAt?: string;

  @ApiPropertyOptional({
    description: 'When the registration was canceled',
    example: '2025-10-18T10:00:00.000Z',
    format: 'date-time',
  })
  canceledAt?: string;

  @ApiPropertyOptional({
    description: 'Additional notes from the donor',
    example: 'Available to donate on weekday mornings',
  })
  notes?: string;
}
