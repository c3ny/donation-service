import { DateType } from 'src/types/entity.types';

export enum DonationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export interface Location {
  latitude: number;
  longitude: number;
}

export class Donation {
  id: string;
  status: DonationStatus;
  content: string;
  startDate: DateType;
  location: Location;
  bloodType: BloodType;
  image?: string;
  name?: string;
  description: string;
  finishDate?: DateType;
  userId: string;
  phone: string;
  
}
