import { Inject, Injectable } from '@nestjs/common';
import { Registration } from '../../core/domain/registration.entity';
import { REGISTRATION_REPOSITORY } from '../../../constants';
import { UseCase } from 'src/types/useCase.types';
import { Result } from 'src/types/result.types';
import { RegistrationRepositoryPort } from '../out/registration-repository.port';
import { RegistrationErrorsEnum } from '../../core/errors/errors.enum';
import { RegistrationResultFactory } from '../../../types/result.types';

@Injectable()
export class FindRegistrationsByUserUseCase
  implements
    UseCase<string, Promise<Result<Registration[], RegistrationErrorsEnum>>>
{
  private resultFactory = new RegistrationResultFactory<Registration[]>();

  constructor(
    @Inject(REGISTRATION_REPOSITORY)
    private readonly registrationRepository: RegistrationRepositoryPort,
  ) {}

  async execute(
    userId: string,
  ): Promise<Result<Registration[], RegistrationErrorsEnum>> {
    const registrations =
      await this.registrationRepository.findByUserId(userId);

    return this.resultFactory.success(registrations);
  }
}
