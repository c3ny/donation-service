import { Types } from 'mongoose';
import { Donation } from 'src/application/core/domain/donation.entity';

export class DonationMapper {
  static toDomain(donation: Donation & { _id: Types.ObjectId }): Donation {
    return {
      id: donation._id.toString(),
      status: donation.status,
      content: donation.content,
      startDate: donation.startDate,
      location: donation.location,
      bloodType: donation.bloodType,
      image: donation.image,
      name: donation.name,
      finishDate: donation.finishDate,
      userId: donation.userId,
      description: donation.description,
      phone: donation.phone,
    };
  }
}
