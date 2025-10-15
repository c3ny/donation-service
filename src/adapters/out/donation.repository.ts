import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Donation } from 'src/application/core/domain/donation.entity';
import { Donation as DonationDocument } from './domain/donation.entity';
import { Model } from 'mongoose';
import { DonationRepositoryPort } from 'src/application/ports/out/donation-repostory.port';
import {
  BloodType,
  DonationStatus,
} from 'src/application/core/domain/donation.entity';
import { DonationMapper } from './mapper/donation.mapper';
import { PaginationParams, PaginatedResult } from 'src/types/pagination.types';

@Injectable()
export class DonationRepository implements DonationRepositoryPort {
  constructor(
    @InjectModel(DonationDocument.name)
    private donationModel: Model<DonationDocument>,
  ) {}

  async save(donation: Omit<Donation, 'id'>): Promise<Donation> {
    const savedDonation = await this.donationModel.create(donation);

    return savedDonation;
  }

  async findById(id: string): Promise<Donation | null> {
    return this.donationModel.findById(id).exec();
  }

  async findAll(): Promise<Donation[]> {
    const donations = await this.donationModel
      .find({}, {}, { limit: 10 })
      .exec();

    return donations.map(
      (donation): Donation => DonationMapper.toDomain(donation),
    );
  }

  async findAllPaginated(
    params: PaginationParams,
  ): Promise<PaginatedResult<Donation>> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [donations, total] = await Promise.all([
      this.donationModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.donationModel.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: donations.map(
        (donation): Donation => DonationMapper.toDomain(donation),
      ),
      metadata: {
        page,
        limit,
        total,
        totalPages,
      },
    };
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

  async count(): Promise<number> {
    return this.donationModel.countDocuments().exec();
  }
}
