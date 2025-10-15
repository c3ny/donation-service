import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/types/useCase.types';
import { Result, ResultFactory } from 'src/types/result.types';
import { DonationRepositoryPort } from '../out/donation-repostory.port';
import { DONATION_REPOSITORY } from 'src/constants';

@Injectable()
export class CountDonationsUseCase
  implements UseCase<void, Promise<Result<number>>>
{
  private resultFactory = new ResultFactory<number>();

  constructor(
    @Inject(DONATION_REPOSITORY)
    private readonly donationRepository: DonationRepositoryPort,
  ) {}

  async execute(): Promise<Result<number>> {
    const count = await this.donationRepository.count();

    return this.resultFactory.success(count);
  }
}
