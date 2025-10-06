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

@Injectable()
export class RegistrationService {
  constructor(
    private readonly createRegistrationUseCase: CreateRegistrationUseCase,
    private readonly findRegistrationsByDonationUseCase: FindRegistrationsByDonationUseCase,
    private readonly findRegistrationsByUserUseCase: FindRegistrationsByUserUseCase,
    private readonly updateRegistrationStatusUseCase: UpdateRegistrationStatusUseCase,
    private readonly cancelRegistrationUseCase: CancelRegistrationUseCase,
  ) {}

  async createRegistration(
    input: CreateRegistrationInput,
  ): Promise<Result<Registration, RegistrationErrorsEnum>> {
    return this.createRegistrationUseCase.execute(input);
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
    return this.updateRegistrationStatusUseCase.execute(input);
  }

  async cancelRegistration(
    id: string,
  ): Promise<Result<Registration, RegistrationErrorsEnum>> {
    return this.cancelRegistrationUseCase.execute(id);
  }
}
