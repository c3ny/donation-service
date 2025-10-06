import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Donation } from './domain/donation.entity';
import { Model } from 'mongoose';
import { DonationRepositoryPort } from 'src/application/ports/out/donation-repostory.port';
import {
  BloodType,
  DonationStatus,
} from 'src/application/core/domain/donation.entity';

@Injectable()
export class DonationRepository implements DonationRepositoryPort {
  constructor(
    @InjectModel(Donation.name) private donationModel: Model<Donation>,
  ) {}

  async save(donation: Omit<Donation, 'id'>): Promise<Donation> {
    const savedDonation = await this.donationModel.create(donation);

    return savedDonation;
  }

  async findById(id: string): Promise<Donation | null> {
    return this.donationModel.findById(id).exec();
  }

  async findAll(): Promise<Donation[]> {
    return this.donationModel.find().exec();
  }

  async findByBloodType(bloodType: BloodType): Promise<Donation[]> {
    return this.donationModel.find({ bloodType }).exec();
  }

  async updateStatus(
    id: string,
    status: DonationStatus,
  ): Promise<Donation | null> {
    const updatedDonation = await this.donationModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    return updatedDonation;
  }

  async update(donation: Donation): Promise<Donation | null> {
    const updatedDonation = await this.donationModel
      .findOneAndUpdate(
        { id: donation.id },
        {
          startDate: donation.startDate,
          finishDate: donation.finishDate,
          status: donation.status,
          content: donation.content,
          userId: donation.userId,
          location: donation.location,
        },
        { new: true },
      )
      .exec();

    return updatedDonation;
  }

  async delete(id: string): Promise<void> {
    await this.donationModel.findByIdAndDelete(id).exec();
  }

  async deleteByUserId(userId: string): Promise<number> {
    const result = await this.donationModel.deleteMany({ userId }).exec();
    return result.deletedCount || 0;
  }
}
