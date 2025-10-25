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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { RegistrationService } from '../../application/core/service/registration.service';
import { RegistrationErrorsEnum } from '../../application/core/errors/errors.enum';
import { RegistrationStatus } from '../../application/core/domain/registration.entity';
import {
  CreateRegistrationDto,
  UpdateRegistrationStatusDto,
  RegistrationResponseDto,
} from '../../../../adapters/in/dto/registration.dto';
import { ErrorResponseDto } from 'src/adapters/in/dto/error-response.dto';

@ApiTags('Registrations')
@Controller('/registrations')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @ApiOperation({
    summary: 'Create registration',
    description: 'Register a user as a donor for a donation request.',
  })
  @ApiBody({
    description: 'Registration data',
    type: CreateRegistrationDto,
    examples: {
      basic: {
        summary: 'Basic Registration',
        description: 'Example of a basic donor registration',
        value: {
          donationId: '67123abc456def789012',
          userId: '50f05b0c-5ce0-4920-9960-11f733f713a7',
          notes: 'Available to donate on weekday mornings',
        },
      },
      minimal: {
        summary: 'Minimal Registration',
        description: 'Example of a minimal registration without notes',
        value: {
          donationId: '67123abc456def789012',
          userId: '50f05b0c-5ce0-4920-9960-11f733f713a7',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Registration created successfully',
    type: RegistrationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Donation not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User already registered for this donation',
    type: ErrorResponseDto,
  })
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
  @ApiOperation({
    summary: 'Get registrations by donation',
    description: 'Get all registrations for a specific donation request.',
  })
  @ApiParam({
    name: 'donationId',
    description: 'Donation ID',
    example: '67123abc456def789012',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Registrations retrieved successfully',
    type: [RegistrationResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: ErrorResponseDto,
  })
  async findRegistrationsByDonation(@Param('donationId') donationId: string) {
    const result =
      await this.registrationService.findRegistrationsByDonation(donationId);

    if (!result.isSuccess) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get registrations by user',
    description: 'Get all registrations made by a specific user.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '50f05b0c-5ce0-4920-9960-11f733f713a7',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Registrations retrieved successfully',
    type: [RegistrationResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: ErrorResponseDto,
  })
  async findRegistrationsByUser(@Param('userId') userId: string) {
    const result =
      await this.registrationService.findRegistrationsByUser(userId);

    if (!result.isSuccess) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return result.value;
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update registration status',
    description: 'Update the status of a registration.',
  })
  @ApiParam({
    name: 'id',
    description: 'Registration ID',
    example: 'reg789xyz123',
    format: 'uuid',
  })
  @ApiBody({
    description: 'New registration status',
    type: UpdateRegistrationStatusDto,
    examples: {
      confirm: {
        summary: 'Confirm Registration',
        description: 'Example of confirming a registration',
        value: {
          status: 'CONFIRMED',
        },
      },
      complete: {
        summary: 'Complete Registration',
        description: 'Example of marking a registration as completed',
        value: {
          status: 'COMPLETED',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Registration status updated successfully',
    type: RegistrationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid status',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Registration not found',
    type: ErrorResponseDto,
  })
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
  @ApiOperation({
    summary: 'Cancel registration',
    description: 'Cancel a registration.',
  })
  @ApiParam({
    name: 'id',
    description: 'Registration ID',
    example: 'reg789xyz123',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Registration canceled successfully',
    type: RegistrationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Cannot cancel in current status',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Registration not found',
    type: ErrorResponseDto,
  })
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
