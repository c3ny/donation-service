import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Donation } from './domain/donation.entity';
import { Model } from 'mongoose';
import { DonationRepositoryPort } from 'src/application/ports/out/donation-repostory.port';

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
    return this.donationModel.findById(id);
  }

  async update(donation: Donation): Promise<Donation | null> {
    return this.donationModel.findByIdAndUpdate(donation.id, donation, {
      new: true,
    });
  }

  async delete(id: string): Promise<void> {
    await this.donationModel.findByIdAndDelete(id);
  }
}
