import { Types } from 'mongoose';
import { Registration as RegistrationEntity } from '../../../application/core/domain/registration.entity';
import { Registration as RegistrationDocument } from '../domain/registration.entity';

export class RegistrationMapper {
  static toDomain(
    document: RegistrationDocument & { _id: Types.ObjectId },
  ): RegistrationEntity {
    return {
      id: document._id.toString(),
      donationId: document.donationId,
      userId: document.userId,
      status: document.status,
      registeredAt: document.registeredAt,
      confirmedAt: document.confirmedAt,
      completedAt: document.completedAt,
      canceledAt: document.canceledAt,
      notes: document.notes,
    };
  }

  static toDomainArray(
    documents: (RegistrationDocument & { _id: Types.ObjectId })[],
  ): RegistrationEntity[] {
    return documents.map((doc) => this.toDomain(doc));
  }
}
