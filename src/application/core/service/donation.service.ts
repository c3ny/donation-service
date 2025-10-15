import { Injectable } from '@nestjs/common';
import { CreateDonationUseCase } from '../../ports/in/createDonation.useCase';
import {
  BloodType,
  Donation,
  DonationStatus,
} from '../../core/domain/donation.entity';
import { Result } from '../../../types/result.types';
import { UpdateStatusUseCase } from 'src/application/ports/in/updateStatus.useCase';
import { FindDonationsByBloodTypeUseCase } from 'src/application/ports/in/findDonationsByBloodType.useCase';
import { FindAllDonationsUseCase } from 'src/application/ports/in/findAllDonations.useCase';
import { DeleteDonationUseCase } from 'src/application/ports/in/deleteDonation.useCase';
import {
  DeleteDonationsByUserIdUseCase,
  DeleteDonationsByUserIdResult,
} from 'src/application/ports/in/deleteDonationsByUserId.useCase';
import { PaginationParams, PaginatedResult } from 'src/types/pagination.types';
import { CountDonationsUseCase } from 'src/application/ports/in/countDonations.useCase';

@Injectable()
export class DonationService {
  constructor(
    private readonly createDonationUseCase: CreateDonationUseCase,
    private readonly updateStatusUseCase: UpdateStatusUseCase,
    private readonly findDonationsByBloodTypeUseCase: FindDonationsByBloodTypeUseCase,
    private readonly findAllDonationsUseCase: FindAllDonationsUseCase,
    private readonly deleteDonationUseCase: DeleteDonationUseCase,
    private readonly deleteDonationsByUserIdUseCase: DeleteDonationsByUserIdUseCase,
    private readonly countDonationsUseCase: CountDonationsUseCase,
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

  async findDonationsByBloodType(
    bloodType: BloodType,
  ): Promise<Result<Donation[]>> {
    return this.findDonationsByBloodTypeUseCase.execute(bloodType);
  }

  async findAllDonations(
    params: PaginationParams,
  ): Promise<Result<PaginatedResult<Donation>>> {
    return this.findAllDonationsUseCase.execute(params);
  }

  async deleteDonation(id: string): Promise<Result<void>> {
    return this.deleteDonationUseCase.execute(id);
  }

  async deleteDonationsByUserId(
    userId: string,
  ): Promise<Result<DeleteDonationsByUserIdResult>> {
    return this.deleteDonationsByUserIdUseCase.execute(userId);
  }

  async countDonations(): Promise<Result<number>> {
    return this.countDonationsUseCase.execute();
  }
}
