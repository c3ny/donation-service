import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/types/useCase.types';
import { Result, ResultFactory } from 'src/types/result.types';
import { Donation } from 'src/application/core/domain/donation.entity';
import { DonationRepositoryPort } from '../out/donation-repostory.port';
import { DONATION_REPOSITORY } from 'src/constants';
import {
  PaginationParams,
  PaginatedResult,
} from 'src/types/pagination.types';

@Injectable()
export class FindAllDonationsUseCase
  implements
    UseCase<PaginationParams, Promise<Result<PaginatedResult<Donation>>>>
{
  private resultFactory = new ResultFactory<PaginatedResult<Donation>>();

  constructor(
    @Inject(DONATION_REPOSITORY)
    private readonly donationRepository: DonationRepositoryPort,
  ) {}

  async execute(
    params: PaginationParams,
  ): Promise<Result<PaginatedResult<Donation>>> {
    const paginatedDonations =
      await this.donationRepository.findAllPaginated(params);

    return this.resultFactory.success(paginatedDonations);
  }
}
