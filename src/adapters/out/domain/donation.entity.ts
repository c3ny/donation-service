import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  BloodType,
  DonationStatus,
  Location,
} from 'src/application/core/domain/donation.entity';
import { Donation as DonationDomain } from 'src/application/core/domain/donation.entity';
import { Document } from 'mongoose';
@Schema()
export class Donation extends Document implements DonationDomain {
  @Prop()
  declare id: string;

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

  @Prop()
  description: string;

  @Prop()
  phone: string;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);

// Add timestamps to automatically manage createdAt and updatedAt
DonationSchema.set('timestamps', true);
