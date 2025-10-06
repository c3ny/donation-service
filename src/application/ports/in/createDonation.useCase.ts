import { Inject, Injectable } from '@nestjs/common';
import { Donation } from 'src/application/core/domain/donation.entity';
import { DONATION_REPOSITORY } from 'src/constants';
import { UseCase } from 'src/types/useCase.types';
import { Result, ResultFactory } from '../../../types/result.types';
import { DonationRepositoryPort } from 'src/application/ports/out/donation-repostory.port';
import {
  sanitizeContent,
  isValidContent,
} from 'src/application/core/utils/sanitize.util';
import { ErrorsEnum } from 'src/application/core/errors/errors.enum';

@Injectable()
export class CreateDonationUseCase
  implements UseCase<Donation, Promise<Result<Donation, ErrorsEnum>>>
{
  private resultFactory = new ResultFactory<Donation, ErrorsEnum>();

  constructor(
    @Inject(DONATION_REPOSITORY)
    private readonly donationRepository: DonationRepositoryPort,
  ) {}

  async execute(
    donation: Omit<Donation, 'id'>,
  ): Promise<Result<Donation, ErrorsEnum>> {
    // Validate content is not empty
    if (!isValidContent(donation.content)) {
      return this.resultFactory.failure(ErrorsEnum.InvalidContent);
    }

    // Sanitize content to prevent XSS attacks
    const sanitizedDonation = {
      ...donation,
      content: sanitizeContent(donation.content),
    };

    const savedDonation = await this.donationRepository.save(sanitizedDonation);

    return this.resultFactory.success(savedDonation);
  }
}
