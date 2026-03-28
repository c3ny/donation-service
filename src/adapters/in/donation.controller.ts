import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
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
  DonationResponseDto,
  PaginatedDonationsResponseDto,
  CountResponseDto,
  DeleteResponseDto,
  DeleteByUserIdResponseDto,
  ErrorResponseDto,
} from './dto/donation-response.dto';
import { CreateDonationDto } from './dto/create-donation.dto';

@ApiTags('Donations')
@Controller('/donations')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Get('count')
  @ApiOperation({ summary: 'Count donations' })
  @ApiResponse({ status: 200, type: CountResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  async countDonations() {
    const result = await this.donationService.countDonations();
    if (!result.isSuccess) {
      throw new HttpException((result as any).error, HttpStatus.BAD_REQUEST);
    }
    return { count: result.value };
  }

  @Get('blood-type/:bloodType')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get donations by blood type' })
  @ApiParam({ name: 'bloodType', enum: BloodType })
  @ApiResponse({ status: 200, type: [DonationResponseDto] })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  async findByBloodType(@Param('bloodType') bloodType: BloodType) {
    const result =
      await this.donationService.findDonationsByBloodType(bloodType);
    if (!result.isSuccess) {
      const error = (result as any).error;
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get donation by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: DonationResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  async findDonationById(@Param('id') id: string) {
    const result = await this.donationService.findDonationById(id);
    if (!result.isSuccess) {
      const error = (result as any).error;
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
  @ApiOperation({ summary: 'Get all donations' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, type: PaginatedDonationsResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
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
        'Limit must be between 1 and 100',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.donationService.findAllDonations({
      page: pageNumber,
      limit: limitNumber,
    });

    if (!result.isSuccess) {
      const error = (result as any).error;
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create donation' })
  @ApiResponse({ status: 201, type: DonationResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  async createDonation(@Body() body: CreateDonationDto) {
    const donation: Omit<Donation, 'id'> = {
      status: body.status,
      content: body.content,
      startDate: body.startDate,
      finishDate: body.finishDate,
      bloodType: body.bloodType,
      location: {
        latitude: body.location.latitude,
        longitude: body.location.longitude,
      },
      userId: body.userId,
      name: body.name,
      description: body.description ?? '',
      phone: body.phone ?? '',
      image: body.image,
      quantity: body.quantity,
    };

    const result = await this.donationService.createDonation(donation);

    if (!result.isSuccess) {
      const error = (result as any).error;
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update donation status' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: DonationResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Body() status: { status: DonationStatus },
  ) {
    const result = await this.donationService.updateStatus(id, status.status);
    if (!result.isSuccess) {
      const error = (result as any).error;
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete donation' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: DeleteResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  async deleteDonation(@Param('id') id: string) {
    const result = await this.donationService.deleteDonation(id);
    if (!result.isSuccess) {
      const error = (result as any).error;
      switch (error) {
        case ErrorsEnum.DonationNotFound:
          throw new HttpException('Donation not found', HttpStatus.NOT_FOUND);
        default:
          throw new HttpException(
            error ?? 'Error deleting donation',
            HttpStatus.BAD_REQUEST,
          );
      }
    }
    return { message: 'Donation deleted successfully' };
  }

  @Delete('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete donations by user ID' })
  @ApiParam({ name: 'userId' })
  @ApiResponse({ status: 200, type: DeleteByUserIdResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  async deleteDonationsByUserId(
    @Param('userId') userId: string,
    @Req() req: Request,
  ) {
    const authenticatedUserId = (req.user as any).userId;
    if (authenticatedUserId !== userId) {
      throw new ForbiddenException('You can only delete your own donations');
    }
    const result = await this.donationService.deleteDonationsByUserId(userId);
    if (!result.isSuccess) {
      throw new HttpException(
        (result as any).error ?? 'Error deleting donations',
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      message: `Successfully deleted ${result.value.deletedCount} donation(s) for user ${userId}`,
      deletedCount: result.value.deletedCount,
    };
  }
}
