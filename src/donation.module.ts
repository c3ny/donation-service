import { Module } from '@nestjs/common';
import { DonationController } from './adapters/in/donation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Donation,
  DonationSchema,
} from './adapters/out/domain/donation.entity';
import { DONATION_REPOSITORY } from './constants';
import { DonationRepository } from './adapters/out/donation.repository';
import { CreateDonationUseCase } from './application/ports/in/createDonation.useCase';
import { DonationService } from './application/core/service/donation.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo_donation_service:27017/`,
      {
        dbName: 'donation',
      },
    ),
    MongooseModule.forFeature([
      { name: Donation.name, schema: DonationSchema },
    ]),
  ],
  controllers: [DonationController],
  providers: [
    { provide: DONATION_REPOSITORY, useClass: DonationRepository },
    CreateDonationUseCase,
    DonationService,
  ],
})
export class AppModule {}
