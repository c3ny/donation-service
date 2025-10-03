import {
  Donation,
  DonationStatus,
} from 'src/application/core/domain/donation.entity';

export interface DonationRepositoryPort {
  save(donation: Omit<Donation, 'id'>): Promise<Donation>;
  findById(id: string): Promise<Donation | null>;
  update(donation: Donation): Promise<Donation | null>;
  updateStatus(id: string, status: DonationStatus): Promise<Donation | null>;
  delete(id: string): Promise<void>;
}
