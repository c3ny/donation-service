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
} from '@nestjs/common';
import {
  BloodType,
  Donation,
  DonationStatus,
} from 'src/application/core/domain/donation.entity';
import { DonationService } from 'src/application/core/service/donation.service';
import { ErrorsEnum } from 'src/application/core/errors/errors.enum';

@Controller('/donations')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Get()
  async findAllDonations() {
    const result = await this.donationService.findAllDonations();

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

  @Get('blood-type/:bloodType')
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

  @Delete(':id')
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
