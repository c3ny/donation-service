import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RegistrationStatus } from '../../../application/core/domain/registration.entity';

export type RegistrationDocument = HydratedDocument<Registration>;

@Schema({ collection: 'registrations', timestamps: true })
export class Registration {
  @Prop({ required: true })
  donationId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({
    required: true,
    enum: RegistrationStatus,
    default: RegistrationStatus.PENDING,
  })
  status: RegistrationStatus;

  @Prop({ required: true, default: Date.now })
  registeredAt: Date;

  @Prop({ required: false })
  confirmedAt?: Date;

  @Prop({ required: false })
  completedAt?: Date;

  @Prop({ required: false })
  canceledAt?: Date;

  @Prop({ required: false })
  notes?: string;
}

export const RegistrationSchema = SchemaFactory.createForClass(Registration);
