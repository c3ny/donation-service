import { Inject, Injectable } from '@nestjs/common';
import {
  Registration,
  RegistrationStatus,
} from '../../core/domain/registration.entity';
import { REGISTRATION_REPOSITORY } from '../../../constants';
import { UseCase } from 'src/types/useCase.types';
import { Result } from 'src/types/result.types';
import { RegistrationRepositoryPort } from '../out/registration-repository.port';
import { RegistrationErrorsEnum } from '../../core/errors/errors.enum';
import { RegistrationResultFactory } from '../../../types/result.types';

export type CreateRegistrationInput = {
  donationId: string;
  userId: string;
  notes?: string;
};

@Injectable()
export class CreateRegistrationUseCase
  implements
    UseCase<
      CreateRegistrationInput,
      Promise<Result<Registration, RegistrationErrorsEnum>>
    >
{
  private resultFactory = new RegistrationResultFactory<Registration>();

  constructor(
    @Inject(REGISTRATION_REPOSITORY)
    private readonly registrationRepository: RegistrationRepositoryPort,
  ) {}

  async execute(
    input: CreateRegistrationInput,
  ): Promise<Result<Registration, RegistrationErrorsEnum>> {
    // Check if user already registered for this donation
    const existingRegistration =
      await this.registrationRepository.findByDonationIdAndUserId(
        input.donationId,
        input.userId,
      );

    if (existingRegistration) {
      return this.resultFactory.failure(
        RegistrationErrorsEnum.UserAlreadyRegistered,
      );
    }

    const registration: Omit<Registration, 'id'> = {
      donationId: input.donationId,
      userId: input.userId,
      status: RegistrationStatus.PENDING,
      registeredAt: new Date(),
      notes: input.notes,
    };

    const savedRegistration =
      await this.registrationRepository.save(registration);

    return this.resultFactory.success(savedRegistration);
  }
}
