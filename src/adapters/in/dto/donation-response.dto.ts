import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  DonationStatus,
  BloodType,
} from 'src/application/core/domain/donation.entity';

export class LocationResponseDto {
  @ApiProperty({
    description: 'Latitude coordinate',
    example: -23.5505,
    type: 'number',
    format: 'double',
  })
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: -46.6333,
    type: 'number',
    format: 'double',
  })
  longitude: number;
}

export class DonationResponseDto {
  @ApiProperty({
    description: 'Donation unique identifier',
    example: '67123abc456def789012',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Current donation status',
    enum: DonationStatus,
    example: DonationStatus.PENDING,
  })
  status: DonationStatus;

  @ApiProperty({
    description: 'Description of the donation request',
    example: 'Urgent blood donation needed for surgery at Hospital São Paulo',
  })
  content: string;

  @ApiProperty({
    description: 'When the donation is needed',
    example: '2025-10-20T10:00:00.000Z',
    format: 'date-time',
  })
  startDate: string;

  @ApiPropertyOptional({
    description: 'Optional deadline for the donation',
    example: '2025-10-22T18:00:00.000Z',
    format: 'date-time',
  })
  finishDate?: string;

  @ApiProperty({
    description: 'Required blood type',
    enum: BloodType,
    example: BloodType.A_POSITIVE,
  })
  bloodType: BloodType;

  @ApiProperty({
    description: 'Geographic coordinates where the donation is needed',
    type: LocationResponseDto,
  })
  location: LocationResponseDto;

  @ApiProperty({
    description: 'ID of the user who created the request',
    example: '50f05b0c-5ce0-4920-9960-11f733f713a7',
    format: 'uuid',
  })
  userId: string;

  @ApiPropertyOptional({
    description: 'Name of the requester (person/hospital)',
    example: 'Hospital São Paulo',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'URL to an image related to the donation request',
    example: 'https://example.com/donation-image.jpg',
  })
  image?: string;
}

export class PaginationMetadataDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 15,
  })
  totalPages: number;
}

export class PaginatedDonationsResponseDto {
  @ApiProperty({
    description: 'Array of donations',
    type: [DonationResponseDto],
  })
  data: DonationResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetadataDto,
  })
  metadata: PaginationMetadataDto;
}

export class CountResponseDto {
  @ApiProperty({
    description: 'Total number of donations',
    example: 150,
  })
  count: number;
}

export class DeleteResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Donation deleted successfully',
  })
  message: string;
}

export class DeleteByUserIdResponseDto {
  @ApiProperty({
    description: 'Success message with count',
    example: 'Successfully deleted 3 donation(s) for user user123',
  })
  message: string;

  @ApiProperty({
    description: 'Number of donations deleted',
    example: 3,
  })
  deletedCount: number;
}

// ErrorResponseDto is now imported from error-response.dto.ts
export { ErrorResponseDto } from './error-response.dto';
