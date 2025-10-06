import {
  BloodType,
  Donation,
  DonationStatus,
} from 'src/application/core/domain/donation.entity';

export interface DonationRepositoryPort {
  save(donation: Omit<Donation, 'id'>): Promise<Donation>;
  findById(id: string): Promise<Donation | null>;
  findAll(): Promise<Donation[]>;
  findByBloodType(bloodType: BloodType): Promise<Donation[]>;
  update(donation: Donation): Promise<Donation | null>;
  updateStatus(id: string, status: DonationStatus): Promise<Donation | null>;
  delete(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<number>;
}
