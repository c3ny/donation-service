import { Injectable } from '@nestjs/common';
import { CreateDonationUseCase } from '../../ports/in/createDonation.useCase';
import { Donation, DonationStatus } from '../../core/domain/donation.entity';
import { Result } from '../../../types/result.types';
import { UpdateStatusUseCase } from 'src/application/ports/in/updateStatus.useCase';

@Injectable()
export class DonationService {
  constructor(
    private readonly createDonationUseCase: CreateDonationUseCase,
    private readonly updateStatusUseCase: UpdateStatusUseCase,
  ) {}

  async createDonation(
    donation: Omit<Donation, 'id'>,
  ): Promise<Result<Donation>> {
    return this.createDonationUseCase.execute(donation);
  }

  async updateStatus(
    id: string,
    status: DonationStatus,
  ): Promise<Result<Donation>> {
    return this.updateStatusUseCase.execute({ id, status });
  }
}
