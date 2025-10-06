import { DateType } from 'src/types/entity.types';

export enum RegistrationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export class Registration {
  id: string;
  donationId: string;
  userId: string;
  status: RegistrationStatus;
  registeredAt: DateType;
  confirmedAt?: DateType;
  completedAt?: DateType;
  canceledAt?: DateType;
  notes?: string;
}
