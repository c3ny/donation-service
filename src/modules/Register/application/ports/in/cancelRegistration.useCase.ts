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

@Injectable()
export class CancelRegistrationUseCase
  implements
    UseCase<string, Promise<Result<Registration, RegistrationErrorsEnum>>>
{
  constructor(
    @Inject(REGISTRATION_REPOSITORY)
    private readonly registrationRepository: RegistrationRepositoryPort,
  ) {}

  async execute(
    id: string,
  ): Promise<Result<Registration, RegistrationErrorsEnum>> {
    const registration = await this.registrationRepository.findById(id);

    if (!registration) {
      return RegistrationResultFactory.failure(
        RegistrationErrorsEnum.RegistrationNotFound,
      );
    }

    const statusAllowedToCancel = [
      RegistrationStatus.PENDING,
      RegistrationStatus.CONFIRMED,
    ];

    if (!statusAllowedToCancel.includes(registration.status)) {
      return RegistrationResultFactory.failure(
        RegistrationErrorsEnum.CannotCancelRegistration,
      );
    }

    const updatedRegistration = await this.registrationRepository.updateStatus(
      id,
      RegistrationStatus.CANCELED,
    );

    if (!updatedRegistration) {
      return RegistrationResultFactory.failure(
        RegistrationErrorsEnum.RegistrationNotFound,
      );
    }

    return RegistrationResultFactory.success(updatedRegistration);
  }
}
