import { Inject, Injectable } from '@nestjs/common';
import {
  BloodType,
  Donation,
} from 'src/application/core/domain/donation.entity';
import { DonationRepositoryPort } from 'src/application/ports/out/donation-repostory.port';
import { DONATION_REPOSITORY } from 'src/constants';
import { Result, ResultFactory } from 'src/types/result.types';
import { UseCase } from 'src/types/useCase.types';

@Injectable()
export class FindDonationsByBloodTypeUseCase
  implements UseCase<BloodType, Promise<Result<Donation[]>>>
{
  constructor(
    @Inject(DONATION_REPOSITORY)
    private readonly donationRepository: DonationRepositoryPort,
  ) {}

  async execute(bloodType: BloodType): Promise<Result<Donation[]>> {
    const donations = await this.donationRepository.findByBloodType(bloodType);

    return ResultFactory.success(donations);
  }
}
