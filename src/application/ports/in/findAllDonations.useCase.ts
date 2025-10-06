import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/types/useCase.types';
import { Result, ResultFactory } from 'src/types/result.types';
import { Donation } from 'src/application/core/domain/donation.entity';
import { DonationRepositoryPort } from '../out/donation-repostory.port';
import { DONATION_REPOSITORY } from 'src/constants';

@Injectable()
export class FindAllDonationsUseCase
  implements UseCase<void, Promise<Result<Donation[]>>>
{
  private resultFactory = new ResultFactory<Donation[]>();

  constructor(
    @Inject(DONATION_REPOSITORY)
    private readonly donationRepository: DonationRepositoryPort,
  ) {}

  async execute(): Promise<Result<Donation[]>> {
    const donations = await this.donationRepository.findAll();
    return this.resultFactory.success(donations);
  }
}
