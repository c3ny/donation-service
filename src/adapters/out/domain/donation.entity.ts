import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  BloodType,
  DonationStatus,
  Location,
} from 'src/application/core/domain/donation.entity';
import { Donation as DonationDomain } from 'src/application/core/domain/donation.entity';
@Schema()
export class Donation implements DonationDomain {
  @Prop()
  id: string;

  @Prop()
  status: DonationStatus;

  @Prop()
  content: string;

  @Prop()
  startDate: Date;

  @Prop(
    raw({
      latitude: { type: Number },
      longitude: { type: Number },
    }),
  )
  location: Location;

  @Prop()
  bloodType: BloodType;

  @Prop()
  image?: string;

  @Prop()
  name?: string;

  @Prop()
  finishDate: Date;

  @Prop()
  userId: string;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);
