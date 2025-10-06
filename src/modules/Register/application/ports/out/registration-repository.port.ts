import {
  Registration,
  RegistrationStatus,
} from '../../core/domain/registration.entity';

export interface RegistrationRepositoryPort {
  save(registration: Omit<Registration, 'id'>): Promise<Registration>;
  findById(id: string): Promise<Registration | null>;
  findByDonationId(donationId: string): Promise<Registration[]>;
  findByUserId(userId: string): Promise<Registration[]>;
  findByDonationIdAndUserId(
    donationId: string,
    userId: string,
  ): Promise<Registration | null>;
  update(registration: Registration): Promise<Registration | null>;
  updateStatus(
    id: string,
    status: RegistrationStatus,
  ): Promise<Registration | null>;
  delete(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  deleteByDonationId(donationId: string): Promise<void>;
}
