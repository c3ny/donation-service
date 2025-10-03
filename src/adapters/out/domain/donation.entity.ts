import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DonationStatus } from 'src/application/core/domain/donation.entity';

@Schema()
export class Donation {
  @Prop()
  id: string;

  @Prop()
  status: DonationStatus;

  @Prop()
  startDate: Date;

  @Prop()
  finishDate: Date;

  @Prop()
  userId: string;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);
