import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  BloodType,
  Donation,
  DonationStatus,
} from 'src/application/core/domain/donation.entity';
import { DonationService } from 'src/application/core/service/donation.service';
import { ErrorsEnum } from 'src/application/core/errors/errors.enum';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import {
  CreateDonationDto,
  UpdateDonationStatusDto,
} from './dto/create-donation.dto';
import {
  DonationResponseDto,
  PaginatedDonationsResponseDto,
  CountResponseDto,
  DeleteResponseDto,
  DeleteByUserIdResponseDto,
  ErrorResponseDto,
} from './dto/donation-response.dto';

@ApiTags('Donations')
@Controller('/donations')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Get('count')
  @ApiOperation({
    summary: 'Count donations',
    description: 'Get the total number of donations in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'Total count retrieved successfully',
    type: CountResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: ErrorResponseDto,
  })
  async countDonations() {
    const result = await this.donationService.countDonations();

    if (!result.isSuccess) {
      const error = result.error;
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }

    return { count: result.value };
  }

  @Get('blood-type/:bloodType')
  @ApiOperation({
    summary: 'Get donations by blood type',
    description: 'Retrieve all donations for a specific blood type.',
  })
  @ApiParam({
    name: 'bloodType',
    description: 'Blood type to filter by',
    enum: BloodType,
    example: BloodType.A_POSITIVE,
  })
  @ApiResponse({
    status: 200,
    description: 'Donations retrieved successfully',
    type: [DonationResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No donations found for the blood type',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: ErrorResponseDto,
  })
  async findByBloodType(@Param('bloodType') bloodType: BloodType) {
    const result =
      await this.donationService.findDonationsByBloodType(bloodType);

    if (!result.isSuccess) {
      const error = result.error;

      switch (error) {
        case ErrorsEnum.DonationNotFound:
          throw new HttpException(error, HttpStatus.NOT_FOUND);
        default:
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }

    return result.value;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get donation by ID',
    description: 'Retrieve a specific donation by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Donation ID',
    example: '67123abc456def789012',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Donation retrieved successfully',
    type: DonationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Donation not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: ErrorResponseDto,
  })
  async findDonationById(@Param('id') id: string) {
    const result = await this.donationService.findDonationById(id);

    if (!result.isSuccess) {
      const error = result.error;

      switch (error) {
        case ErrorsEnum.DonationNotFound:
          throw new HttpException('Donation not found', HttpStatus.NOT_FOUND);
        default:
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }

    return result.value;
  }

  @Get()
  @ApiOperation({
    summary: 'Get all donations',
    description: 'Retrieve a paginated list of all donations.',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number (must be >= 1)',
    required: false,
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Items per page (1-100)',
    required: false,
    example: 10,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Donations retrieved successfully',
    type: PaginatedDonationsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid pagination parameters',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No donations found',
    type: ErrorResponseDto,
  })
  async findAllDonations(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || pageNumber < 1) {
      throw new HttpException(
        'Page must be a positive number',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100) {
      throw new HttpException(
        'Limit must be a positive number between 1 and 100',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.donationService.findAllDonations({
      page: pageNumber,
      limit: limitNumber,
    });

    if (!result.isSuccess) {
      const error = result.error;
      switch (error) {
        case ErrorsEnum.DonationNotFound:
          throw new HttpException(error, HttpStatus.NOT_FOUND);
        default:
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }

    return result.value;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create donation',
    description:
      'Create a new blood donation request. Requires JWT authentication.',
  })
  @ApiBody({
    description: 'Donation request data',
    type: CreateDonationDto,
    examples: {
      urgentSurgery: {
        summary: 'Urgent Surgery Request',
        description: 'Example of an urgent blood donation request for surgery',
        value: {
          status: 'PENDING',
          content:
            'Urgent blood donation needed for emergency surgery at Hospital São Paulo',
          startDate: '2025-10-20T10:00:00.000Z',
          finishDate: '2025-10-22T18:00:00.000Z',
          bloodType: 'A+',
          location: {
            latitude: -23.5505,
            longitude: -46.6333,
          },
          userId: '50f05b0c-5ce0-4920-9960-11f733f713a7',
          name: 'Hospital São Paulo',
          image: 'https://example.com/surgery-request.jpg',
        },
      },
      regularDonation: {
        summary: 'Regular Donation Request',
        description: 'Example of a regular blood donation request',
        value: {
          status: 'PENDING',
          content: 'Blood donation needed for routine medical procedures',
          startDate: '2025-10-25T09:00:00.000Z',
          bloodType: 'O+',
          location: {
            latitude: -23.5505,
            longitude: -46.6333,
          },
          userId: '50f05b0c-5ce0-4920-9960-11f733f713a7',
          name: 'Blood Center ABC',
        },
      },
    },
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 201,
    description: 'Donation created successfully',
    type: DonationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid content or malicious code detected',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid JWT token',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: ErrorResponseDto,
  })
  async createDonation(@Body() donation: Omit<Donation, 'id'>) {
    const result = await this.donationService.createDonation(donation);

    if (!result.isSuccess) {
      const error = result.error;

      switch (error) {
        case ErrorsEnum.DonationNotFound:
          throw new HttpException(error, HttpStatus.NOT_FOUND);
        case ErrorsEnum.InvalidContent:
          throw new HttpException(
            'Content is invalid or contains malicious code',
            HttpStatus.BAD_REQUEST,
          );
        default:
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }

    return result.value;
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update donation status',
    description:
      'Update the status of a donation. Requires JWT authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Donation ID',
    example: '67123abc456def789012',
    format: 'uuid',
  })
  @ApiBody({
    description: 'New donation status',
    type: UpdateDonationStatusDto,
    examples: {
      approve: {
        summary: 'Approve Donation',
        description: 'Example of approving a donation request',
        value: {
          status: 'APPROVED',
        },
      },
      complete: {
        summary: 'Complete Donation',
        description: 'Example of marking a donation as completed',
        value: {
          status: 'COMPLETED',
        },
      },
      cancel: {
        summary: 'Cancel Donation',
        description: 'Example of canceling a donation request',
        value: {
          status: 'CANCELED',
        },
      },
    },
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Donation status updated successfully',
    type: DonationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid JWT token',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Donation not found',
    type: ErrorResponseDto,
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() status: { status: DonationStatus },
  ) {
    const result = await this.donationService.updateStatus(id, status.status);

    if (!result.isSuccess) {
      const error = result.error;

      switch (error) {
        case ErrorsEnum.DonationNotFound:
          throw new HttpException(error, HttpStatus.NOT_FOUND);
        default:
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }

    return result.value;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete donation',
    description: 'Delete a specific donation. Requires JWT authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Donation ID',
    example: '67123abc456def789012',
    format: 'uuid',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Donation deleted successfully',
    type: DeleteResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing or invalid JWT token',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Donation not found',
    type: ErrorResponseDto,
  })
  async deleteDonation(@Param('id') id: string) {
    const result = await this.donationService.deleteDonation(id);

    if (!result.isSuccess) {
      const error = result.error;

      switch (error) {
        case ErrorsEnum.DonationNotFound:
          throw new HttpException('Donation not found', HttpStatus.NOT_FOUND);
        default:
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }

    return { message: 'Donation deleted successfully' };
  }

  @Delete('user/:userId')
  @ApiOperation({
    summary: 'Delete donations by user ID',
    description: 'Delete all donations created by a specific user.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '50f05b0c-5ce0-4920-9960-11f733f713a7',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Donations deleted successfully',
    type: DeleteByUserIdResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: ErrorResponseDto,
  })
  async deleteDonationsByUserId(@Param('userId') userId: string) {
    const result = await this.donationService.deleteDonationsByUserId(userId);

    if (!result.isSuccess) {
      const error = result.error;
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }

    return {
      message: `Successfully deleted ${result.value.deletedCount} donation(s) for user ${userId}`,
      deletedCount: result.value.deletedCount,
    };
  }
}
