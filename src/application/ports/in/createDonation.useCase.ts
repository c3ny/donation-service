import { Inject, Injectable } from '@nestjs/common';
import { Donation } from 'src/application/core/domain/donation.entity';
import { DONATION_REPOSITORY } from 'src/constants';
import { UseCase } from 'src/types/useCase.types';
import { Result, ResultFactory } from '../../../types/result.types';
import { DonationRepositoryPort } from 'src/application/ports/out/donation-repostory.port';

@Injectable()
export class CreateDonationUseCase
  implements UseCase<Donation, Promise<Result<Donation>>>
{
  constructor(
    @Inject(DONATION_REPOSITORY)
    private readonly donationRepository: DonationRepositoryPort,
  ) {}

  async execute(donation: Omit<Donation, 'id'>): Promise<Result<Donation>> {
    const savedDonation = await this.donationRepository.save(donation);

    return ResultFactory.success(savedDonation);
  }
}
