import { Donation } from 'src/application/core/domain/donation.entity';

export interface DonationRepositoryPort {
  save(donation: Omit<Donation, 'id'>): Promise<Donation>;
  findById(id: string): Promise<Donation | null>;
  update(donation: Donation): Promise<Donation | null>;
  delete(id: string): Promise<void>;
}
