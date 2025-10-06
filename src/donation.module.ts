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
import { UpdateStatusUseCase } from './application/ports/in/updateStatus.useCase';
import { FindDonationsByBloodTypeUseCase } from './application/ports/in/findDonationsByBloodType.useCase';
import { FindAllDonationsUseCase } from './application/ports/in/findAllDonations.useCase';
import { DeleteDonationUseCase } from './application/ports/in/deleteDonation.useCase';
import { DeleteDonationsByUserIdUseCase } from './application/ports/in/deleteDonationsByUserId.useCase';
import { RegisterModule } from './modules/Register/register.module';

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
    RegisterModule,
  ],
  controllers: [DonationController],
  providers: [
    { provide: DONATION_REPOSITORY, useClass: DonationRepository },
    CreateDonationUseCase,
    DonationService,
    UpdateStatusUseCase,
    FindDonationsByBloodTypeUseCase,
    FindAllDonationsUseCase,
    DeleteDonationUseCase,
    DeleteDonationsByUserIdUseCase,
  ],
})
export class AppModule {}
