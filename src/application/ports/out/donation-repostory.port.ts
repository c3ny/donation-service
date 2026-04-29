import {
  BloodType,
  Donation,
  DonationStatus,
} from 'src/application/core/domain/donation.entity';
import { PaginationParams, PaginatedResult } from 'src/types/pagination.types';

export interface DonationRepositoryPort {
  save(donation: Omit<Donation, 'id'>): Promise<Donation>;
  findById(id: string): Promise<Donation | null>;
  findAll(): Promise<Donation[]>;
  findAllPaginated(
    params: PaginationParams,
  ): Promise<PaginatedResult<Donation>>;
  findByUserId(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResult<Donation>>;
  findByBloodType(bloodType: BloodType): Promise<Donation[]>;
  update(donation: Donation): Promise<Donation | null>;
  updateStatus(id: string, status: DonationStatus): Promise<Donation | null>;
  delete(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<number>;
  count(): Promise<number>;
  /**
   * Marca como COMPLETED toda solicitação cuja `finishDate < now` que esteja
   * em status PENDING ou APPROVED. Idempotente. Retorna quantos foram movidos.
   */
  autoCompleteExpired(now?: Date): Promise<number>;
}
