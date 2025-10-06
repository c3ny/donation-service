import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { REGISTRATION_REPOSITORY } from './constants';
import { RegistrationRepository } from './adapters/out/registration.repository';
import { RegistrationController } from './adapters/in/registration.controller';
import { RegistrationService } from './application/core/service/registration.service';
import {
  Registration,
  RegistrationSchema,
} from './adapters/out/domain/registration.entity';
import { CreateRegistrationUseCase } from './application/ports/in/createRegistration.useCase';
import { FindRegistrationsByDonationUseCase } from './application/ports/in/findRegistrationsByDonation.useCase';
import { FindRegistrationsByUserUseCase } from './application/ports/in/findRegistrationsByUser.useCase';
import { UpdateRegistrationStatusUseCase } from './application/ports/in/updateRegistrationStatus.useCase';
import { CancelRegistrationUseCase } from './application/ports/in/cancelRegistration.useCase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Registration.name, schema: RegistrationSchema },
    ]),
  ],
  controllers: [RegistrationController],
  providers: [
    {
      provide: REGISTRATION_REPOSITORY,
      useClass: RegistrationRepository,
    },
    RegistrationService,
    CreateRegistrationUseCase,
    FindRegistrationsByDonationUseCase,
    FindRegistrationsByUserUseCase,
    UpdateRegistrationStatusUseCase,
    CancelRegistrationUseCase,
  ],
  exports: [RegistrationService],
})
export class RegisterModule {}
