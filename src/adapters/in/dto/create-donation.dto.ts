import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsObject,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import {
  DonationStatus,
  BloodType,
} from 'src/application/core/domain/donation.entity';

export class LocationDto {
  @ApiProperty({
    description: 'Latitude coordinate',
    example: -23.5505,
    type: 'number',
    format: 'double',
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: -46.6333,
    type: 'number',
    format: 'double',
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}

export class CreateDonationDto {
  @ApiProperty({
    description: 'Current donation status',
    enum: DonationStatus,
    example: DonationStatus.PENDING,
  })
  @IsEnum(DonationStatus)
  status: DonationStatus;

  @ApiProperty({
    description: 'Description of the donation request',
    example: 'Urgent blood donation needed for surgery at Hospital São Paulo',
    minLength: 10,
    maxLength: 1000,
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'When the donation is needed',
    example: '2025-10-20T10:00:00.000Z',
    format: 'date-time',
  })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    description: 'Optional deadline for the donation',
    example: '2025-10-22T18:00:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  finishDate?: string;

  @ApiProperty({
    description: 'Required blood type',
    enum: BloodType,
    example: BloodType.A_POSITIVE,
  })
  @IsEnum(BloodType)
  bloodType: BloodType;

  @ApiProperty({
    description: 'Geographic coordinates where the donation is needed',
    type: LocationDto,
  })
  @IsObject()
  location: LocationDto;

  @ApiProperty({
    description: 'ID of the user creating the request',
    example: '50f05b0c-5ce0-4920-9960-11f733f713a7',
    format: 'uuid',
  })
  @IsString()
  userId: string;

  @ApiPropertyOptional({
    description: 'Name of the requester (person/hospital)',
    example: 'Hospital São Paulo',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'URL to an image related to the donation request',
    example: 'https://example.com/donation-image.jpg',
    format: 'uri',
  })
  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateDonationStatusDto {
  @ApiProperty({
    description: 'New donation status',
    enum: DonationStatus,
    example: DonationStatus.APPROVED,
  })
  @IsEnum(DonationStatus)
  status: DonationStatus;
}

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (must be >= 1)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page (1-100)',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
