import { Inject, Injectable } from '@nestjs/common';
import { Registration } from '../../core/domain/registration.entity';
import { REGISTRATION_REPOSITORY } from '../../../constants';
import { UseCase } from 'src/types/useCase.types';
import { Result } from 'src/types/result.types';
import { RegistrationRepositoryPort } from '../out/registration-repository.port';
import { RegistrationResultFactory } from '../../../types/result.types';
import { RegistrationErrorsEnum } from '../../core/errors/errors.enum';

@Injectable()
export class FindRegistrationsByDonationUseCase
  implements
    UseCase<string, Promise<Result<Registration[], RegistrationErrorsEnum>>>
{
  constructor(
    @Inject(REGISTRATION_REPOSITORY)
    private readonly registrationRepository: RegistrationRepositoryPort,
  ) {}

  async execute(
    donationId: string,
  ): Promise<Result<Registration[], RegistrationErrorsEnum>> {
    const registrations =
      await this.registrationRepository.findByDonationId(donationId);

    return RegistrationResultFactory.success(registrations);
  }
}
