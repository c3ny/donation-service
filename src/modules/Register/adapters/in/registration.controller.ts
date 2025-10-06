import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RegistrationService } from '../../application/core/service/registration.service';
import { RegistrationErrorsEnum } from '../../application/core/errors/errors.enum';
import { RegistrationStatus } from '../../application/core/domain/registration.entity';

@Controller('/registrations')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  async createRegistration(
    @Body() body: { donationId: string; userId: string; notes?: string },
  ) {
    const result = await this.registrationService.createRegistration(body);

    if (!result.isSuccess) {
      const error = result.error;

      switch (error) {
        case RegistrationErrorsEnum.UserAlreadyRegistered:
          throw new HttpException(
            'User already registered for this donation',
            HttpStatus.CONFLICT,
          );
        case RegistrationErrorsEnum.DonationNotFound:
          throw new HttpException('Donation not found', HttpStatus.NOT_FOUND);
        default:
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }

    return result.value;
  }

  @Get('donation/:donationId')
  async findRegistrationsByDonation(@Param('donationId') donationId: string) {
    const result =
      await this.registrationService.findRegistrationsByDonation(donationId);

    if (!result.isSuccess) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Get('user/:userId')
  async findRegistrationsByUser(@Param('userId') userId: string) {
    const result =
      await this.registrationService.findRegistrationsByUser(userId);

    if (!result.isSuccess) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Patch(':id/status')
  async updateRegistrationStatus(
    @Param('id') id: string,
    @Body() body: { status: RegistrationStatus },
  ) {
    const result = await this.registrationService.updateRegistrationStatus(
      id,
      body.status,
    );

    if (!result.isSuccess) {
      const error = result.error;

      switch (error) {
        case RegistrationErrorsEnum.RegistrationNotFound:
          throw new HttpException(
            'Registration not found',
            HttpStatus.NOT_FOUND,
          );
        case RegistrationErrorsEnum.InvalidRegistrationStatus:
          throw new HttpException(
            'Invalid registration status',
            HttpStatus.BAD_REQUEST,
          );
        default:
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }

    return result.value;
  }

  @Patch(':id/cancel')
  async cancelRegistration(@Param('id') id: string) {
    const result = await this.registrationService.cancelRegistration(id);

    if (!result.isSuccess) {
      const error = result.error;

      switch (error) {
        case RegistrationErrorsEnum.RegistrationNotFound:
          throw new HttpException(
            'Registration not found',
            HttpStatus.NOT_FOUND,
          );
        case RegistrationErrorsEnum.CannotCancelRegistration:
          throw new HttpException(
            'Cannot cancel registration in current status',
            HttpStatus.BAD_REQUEST,
          );
        default:
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }

    return result.value;
  }
}
