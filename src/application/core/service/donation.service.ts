import { Inject, Injectable } from '@nestjs/common';
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
import { DonationRepositoryPort } from 'src/application/ports/out/donation-repostory.port';
import { DONATION_REPOSITORY } from 'src/constants';

const AUTO_COMPLETE_THROTTLE_MS = 5 * 60 * 1000; // 5 min

@Injectable()
export class DonationService {
  private lastAutoCompleteAt = 0;

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
    @Inject(DONATION_REPOSITORY)
    private readonly donationRepository: DonationRepositoryPort,
  ) {}

  /**
   * Lazy-eval: marca solicitacoes expiradas como COMPLETED.
   * Throttled a 1x por 5 minutos para evitar overhead em bursts de leitura.
   */
  private async runAutoCompleteIfDue(): Promise<void> {
    const now = Date.now();
    if (now - this.lastAutoCompleteAt < AUTO_COMPLETE_THROTTLE_MS) return;
    this.lastAutoCompleteAt = now;
    try {
      const moved = await this.donationRepository.autoCompleteExpired();
      if (moved > 0) {
        this.logger.info('Auto-completed expired donations', { count: moved });
      }
    } catch (error) {
      this.logger.warn('Auto-complete expired donations failed', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

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
    await this.runAutoCompleteIfDue();
    return this.findDonationsByBloodTypeUseCase.execute(bloodType);
  }

  async findAllDonations(
    params: PaginationParams,
  ): Promise<Result<PaginatedResult<Donation>>> {
    await this.runAutoCompleteIfDue();
    return this.findAllDonationsUseCase.execute(params);
  }

  async findDonationsByUserId(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResult<Donation>> {
    await this.runAutoCompleteIfDue();
    return this.donationRepository.findByUserId(userId, params);
  }

  async findDonationById(id: string): Promise<Result<Donation>> {
    await this.runAutoCompleteIfDue();
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
