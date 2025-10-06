import { Inject, Injectable } from '@nestjs/common';
import { DONATION_REPOSITORY } from 'src/constants';
import { UseCase } from 'src/types/useCase.types';
import { Result, ResultFactory } from '../../../types/result.types';
import { DonationRepositoryPort } from 'src/application/ports/out/donation-repostory.port';

export interface DeleteDonationsByUserIdResult {
  deletedCount: number;
}

@Injectable()
export class DeleteDonationsByUserIdUseCase
  implements UseCase<string, Promise<Result<DeleteDonationsByUserIdResult>>>
{
  constructor(
    @Inject(DONATION_REPOSITORY)
    private readonly donationRepository: DonationRepositoryPort,
  ) {}

  async execute(
    userId: string,
  ): Promise<Result<DeleteDonationsByUserIdResult>> {
    const deletedCount = await this.donationRepository.deleteByUserId(userId);

    return ResultFactory.success({ deletedCount });
  }
}
