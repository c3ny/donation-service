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
  content: string;
  startDate: DateType;
  finishDate?: DateType;
}
