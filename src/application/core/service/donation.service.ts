import { Injectable } from '@nestjs/common';
import { CreateDonationUseCase } from '../../ports/in/createDonation.useCase';
import { Donation } from '../../core/domain/donation.entity';
import { Result } from '../../../types/result.types';

@Injectable()
export class DonationService {
  constructor(private readonly createDonationUseCase: CreateDonationUseCase) {}

  async createDonation(
    donation: Omit<Donation, 'id'>,
  ): Promise<Result<Donation>> {
    return this.createDonationUseCase.execute(donation);
  }
}
