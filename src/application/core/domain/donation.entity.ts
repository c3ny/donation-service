import { DateType } from 'src/types/entity.types';

export enum DonationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export class Donation {
  id: string;
  status: DonationStatus;
  startDate: DateType;
  finishDate?: DateType;
}
