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

export type UpdateRegistrationStatusInput = {
  id: string;
  status: RegistrationStatus;
};

@Injectable()
export class UpdateRegistrationStatusUseCase
  implements
    UseCase<
      UpdateRegistrationStatusInput,
      Promise<Result<Registration, RegistrationErrorsEnum>>
    >
{
  constructor(
    @Inject(REGISTRATION_REPOSITORY)
    private readonly registrationRepository: RegistrationRepositoryPort,
  ) {}

  async execute(
    input: UpdateRegistrationStatusInput,
  ): Promise<Result<Registration, RegistrationErrorsEnum>> {
    const registration = await this.registrationRepository.findById(input.id);

    if (!registration) {
      return RegistrationResultFactory.failure(
        RegistrationErrorsEnum.RegistrationNotFound,
      );
    }

    const updatedRegistration = await this.registrationRepository.updateStatus(
      input.id,
      input.status,
    );

    if (!updatedRegistration) {
      return RegistrationResultFactory.failure(
        RegistrationErrorsEnum.RegistrationNotFound,
      );
    }

    return RegistrationResultFactory.success(updatedRegistration);
  }
}
