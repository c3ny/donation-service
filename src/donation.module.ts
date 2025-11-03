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
import { CountDonationsUseCase } from './application/ports/in/countDonations.useCase';
import { FindDonationByIdUseCase } from './application/ports/in/findDonationById.useCase';
import { AuthModule } from './infrastructure/auth/auth.module';
import { RegisterModule } from './modules/Register/register.module';
import * as dotenv from 'dotenv';

dotenv.config();
const protocol = process.env.MONGO_HOST?.includes('mongodb.net')
  ? 'mongodb+srv'
  : 'mongodb';

const mongoUri = `${protocol}://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}` +
                 `@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}?authSource=admin`;


@Module({
  imports: [
    MongooseModule.forRoot(mongoUri, { dbName: process.env.MONGO_DBNAME }),
    MongooseModule.forFeature([{ name: Donation.name, schema: DonationSchema }]),
    RegisterModule,
    AuthModule,
  ],
  controllers: [DonationController],
  providers: [
    { provide: DONATION_REPOSITORY, useClass: DonationRepository },
    CreateDonationUseCase,
    DonationService,
    UpdateStatusUseCase,
    FindDonationsByBloodTypeUseCase,
    FindAllDonationsUseCase,
    FindDonationByIdUseCase,
    DeleteDonationUseCase,
    DeleteDonationsByUserIdUseCase,
    CountDonationsUseCase,
  ],
})
export class AppModule {}

console.log('MONGO ENV:', {
  user: process.env.MONGO_INITDB_ROOT_USERNAME,
  pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  db: process.env.MONGO_DBNAME,
});
