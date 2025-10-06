import { Inject, Injectable } from '@nestjs/common';
import { DONATION_REPOSITORY } from 'src/constants';
import { UseCase } from 'src/types/useCase.types';
import { Result, ResultFactory } from '../../../types/result.types';
import { DonationRepositoryPort } from 'src/application/ports/out/donation-repostory.port';
import { ErrorsEnum } from 'src/application/core/errors/errors.enum';

@Injectable()
export class DeleteDonationUseCase
  implements UseCase<string, Promise<Result<void>>>
{
  private resultFactory = new ResultFactory<void, ErrorsEnum>();

  constructor(
    @Inject(DONATION_REPOSITORY)
    private readonly donationRepository: DonationRepositoryPort,
  ) {}

  async execute(id: string): Promise<Result<void>> {
    const donation = await this.donationRepository.findById(id);

    if (!donation) {
      return this.resultFactory.failure(ErrorsEnum.DonationNotFound);
    }

    await this.donationRepository.delete(id);

    return this.resultFactory.success(undefined);
  }
}
