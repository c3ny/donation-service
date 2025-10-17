import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/types/useCase.types';
import { Result, ResultFactory } from 'src/types/result.types';
import { Donation } from 'src/application/core/domain/donation.entity';
import { DonationRepositoryPort } from '../out/donation-repostory.port';
import { DONATION_REPOSITORY } from 'src/constants';
import { ErrorsEnum } from 'src/application/core/errors/errors.enum';

@Injectable()
export class FindDonationByIdUseCase
  implements UseCase<string, Promise<Result<Donation>>>
{
  private resultFactory = new ResultFactory<Donation>();

  constructor(
    @Inject(DONATION_REPOSITORY)
    private readonly donationRepository: DonationRepositoryPort,
  ) {}

  async execute(id: string): Promise<Result<Donation>> {
    const donation = await this.donationRepository.findById(id);

    if (!donation) {
      return this.resultFactory.failure(ErrorsEnum.DonationNotFound);
    }

    return this.resultFactory.success(donation);
  }
}
