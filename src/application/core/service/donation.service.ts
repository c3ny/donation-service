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
import { FindDonationByIdUseCase } from 'src/application/ports/in/findDonationById.useCase';
import { AppLoggerService } from 'src/shared/logger/app-logger.service';

@Injectable()
export class DonationService {
  constructor(
    private readonly createDonationUseCase: CreateDonationUseCase,
    private readonly updateStatusUseCase: UpdateStatusUseCase,
    private readonly findDonationsByBloodTypeUseCase: FindDonationsByBloodTypeUseCase,
    private readonly findAllDonationsUseCase: FindAllDonationsUseCase,
    private readonly findDonationByIdUseCase: FindDonationByIdUseCase,
    private readonly deleteDonationUseCase: DeleteDonationUseCase,
    private readonly deleteDonationsByUserIdUseCase: DeleteDonationsByUserIdUseCase,
    private readonly countDonationsUseCase: CountDonationsUseCase,
    private readonly logger: AppLoggerService,
  ) {}

  async createDonation(
    donation: Omit<Donation, 'id'>,
  ): Promise<Result<Donation>> {
    const result = await this.createDonationUseCase.execute(donation);
    if (result.isSuccess) {
      this.logger.info('Donation created', { donationId: result.value.id, userId: donation.userId, bloodType: donation.bloodType });
    } else {
      this.logger.warn('Failed to create donation', { error: result.error, userId: donation.userId });
    }
    return result;
  }

  async updateStatus(
    id: string,
    status: DonationStatus,
  ): Promise<Result<Donation>> {
    const result = await this.updateStatusUseCase.execute({ id, status });
    if (result.isSuccess) {
      this.logger.info('Donation status updated', { donationId: id, status });
    } else {
      this.logger.warn('Failed to update donation status', { donationId: id, status, error: result.error });
    }
    return result;
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

  async findDonationById(id: string): Promise<Result<Donation>> {
    return this.findDonationByIdUseCase.execute(id);
  }

  async deleteDonation(id: string): Promise<Result<void>> {
    const result = await this.deleteDonationUseCase.execute(id);
    if (result.isSuccess) {
      this.logger.info('Donation deleted', { donationId: id });
    } else {
      this.logger.warn('Failed to delete donation', { donationId: id, error: result.error });
    }
    return result;
  }

  async deleteDonationsByUserId(
    userId: string,
  ): Promise<Result<DeleteDonationsByUserIdResult>> {
    const result = await this.deleteDonationsByUserIdUseCase.execute(userId);
    if (result.isSuccess) {
      this.logger.info('Donations deleted by userId', { userId, count: result.value.deletedCount });
    } else {
      this.logger.warn('Failed to delete donations by userId', { userId, error: result.error });
    }
    return result;
  }

  async countDonations(): Promise<Result<number>> {
    return this.countDonationsUseCase.execute();
  }
}
