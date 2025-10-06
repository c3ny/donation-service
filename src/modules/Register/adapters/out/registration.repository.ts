import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegistrationRepositoryPort } from '../../application/ports/out/registration-repository.port';
import {
  Registration as RegistrationEntity,
  RegistrationStatus,
} from '../../application/core/domain/registration.entity';
import { Registration } from './domain/registration.entity';
import { RegistrationMapper } from './mappers/registration.mapper';

@Injectable()
export class RegistrationRepository implements RegistrationRepositoryPort {
  constructor(
    @InjectModel(Registration.name)
    private registrationModel: Model<Registration>,
  ) {}

  async save(
    registration: Omit<RegistrationEntity, 'id'>,
  ): Promise<RegistrationEntity> {
    const savedRegistration = await this.registrationModel.create(registration);
    return RegistrationMapper.toDomain(savedRegistration);
  }

  async findById(id: string): Promise<RegistrationEntity | null> {
    const registration = await this.registrationModel.findById(id).exec();
    return registration ? RegistrationMapper.toDomain(registration) : null;
  }

  async findByDonationId(donationId: string): Promise<RegistrationEntity[]> {
    const registrations = await this.registrationModel
      .find({ donationId })
      .exec();
    return RegistrationMapper.toDomainArray(registrations);
  }

  async findByUserId(userId: string): Promise<RegistrationEntity[]> {
    const registrations = await this.registrationModel.find({ userId }).exec();
    return RegistrationMapper.toDomainArray(registrations);
  }

  async findByDonationIdAndUserId(
    donationId: string,
    userId: string,
  ): Promise<RegistrationEntity | null> {
    const registration = await this.registrationModel
      .findOne({ donationId, userId })
      .exec();
    return registration ? RegistrationMapper.toDomain(registration) : null;
  }

  async update(
    registration: RegistrationEntity,
  ): Promise<RegistrationEntity | null> {
    const updatedRegistration = await this.registrationModel
      .findByIdAndUpdate(registration.id, registration, { new: true })
      .exec();
    return updatedRegistration
      ? RegistrationMapper.toDomain(updatedRegistration)
      : null;
  }

  async updateStatus(
    id: string,
    status: RegistrationStatus,
  ): Promise<RegistrationEntity | null> {
    const updateData: Partial<Registration> = { status };

    // Set timestamp based on status
    switch (status) {
      case RegistrationStatus.CONFIRMED:
        updateData.confirmedAt = new Date();
        break;
      case RegistrationStatus.COMPLETED:
        updateData.completedAt = new Date();
        break;
      case RegistrationStatus.CANCELED:
        updateData.canceledAt = new Date();
        break;
    }

    const updatedRegistration = await this.registrationModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    return updatedRegistration
      ? RegistrationMapper.toDomain(updatedRegistration)
      : null;
  }

  async delete(id: string): Promise<void> {
    await this.registrationModel.findByIdAndDelete(id).exec();
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.registrationModel.deleteMany({ userId }).exec();
  }

  async deleteByDonationId(donationId: string): Promise<void> {
    await this.registrationModel.deleteMany({ donationId }).exec();
  }
}
