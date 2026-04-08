import { Injectable } from '@nestjs/common';
import {
  Registration,
  RegistrationStatus,
} from '../domain/registration.entity';
import { Result } from 'src/types/result.types';
import {
  CreateRegistrationInput,
  CreateRegistrationUseCase,
} from '../../ports/in/createRegistration.useCase';
import { FindRegistrationsByDonationUseCase } from '../../ports/in/findRegistrationsByDonation.useCase';
import { FindRegistrationsByUserUseCase } from '../../ports/in/findRegistrationsByUser.useCase';
import {
  UpdateRegistrationStatusInput,
  UpdateRegistrationStatusUseCase,
} from '../../ports/in/updateRegistrationStatus.useCase';
import { CancelRegistrationUseCase } from '../../ports/in/cancelRegistration.useCase';
import { RegistrationErrorsEnum } from '../errors/errors.enum';
import { AppLoggerService } from 'src/shared/logger/app-logger.service';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly createRegistrationUseCase: CreateRegistrationUseCase,
    private readonly findRegistrationsByDonationUseCase: FindRegistrationsByDonationUseCase,
    private readonly findRegistrationsByUserUseCase: FindRegistrationsByUserUseCase,
    private readonly updateRegistrationStatusUseCase: UpdateRegistrationStatusUseCase,
    private readonly cancelRegistrationUseCase: CancelRegistrationUseCase,
    private readonly logger: AppLoggerService,
  ) {}

  async createRegistration(
    input: CreateRegistrationInput,
  ): Promise<Result<Registration, RegistrationErrorsEnum>> {
    const result = await this.createRegistrationUseCase.execute(input);
    if (result.isSuccess) {
      this.logger.info('Registration created', { registrationId: result.value.id, donationId: input.donationId, userId: input.userId });
    } else {
      this.logger.warn('Failed to create registration', { error: result.error, donationId: input.donationId, userId: input.userId });
    }
    return result;
  }

  async findRegistrationsByDonation(
    donationId: string,
  ): Promise<Result<Registration[], RegistrationErrorsEnum>> {
    return this.findRegistrationsByDonationUseCase.execute(donationId);
  }

  async findRegistrationsByUser(
    userId: string,
  ): Promise<Result<Registration[], RegistrationErrorsEnum>> {
    return this.findRegistrationsByUserUseCase.execute(userId);
  }

  async updateRegistrationStatus(
    id: string,
    status: RegistrationStatus,
  ): Promise<Result<Registration, RegistrationErrorsEnum>> {
    const input: UpdateRegistrationStatusInput = { id, status };
    const result = await this.updateRegistrationStatusUseCase.execute(input);
    if (result.isSuccess) {
      this.logger.info('Registration status updated', { registrationId: id, status });
    } else {
      this.logger.warn('Failed to update registration status', { registrationId: id, status, error: result.error });
    }
    return result;
  }

  async cancelRegistration(
    id: string,
  ): Promise<Result<Registration, RegistrationErrorsEnum>> {
    const result = await this.cancelRegistrationUseCase.execute(id);
    if (result.isSuccess) {
      this.logger.info('Registration cancelled', { registrationId: id });
    } else {
      this.logger.warn('Failed to cancel registration', { registrationId: id, error: result.error });
    }
    return result;
  }
}
