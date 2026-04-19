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

    return DonationMapper.toDomain(
      savedDonation as Donation & { _id: import('mongoose').Types.ObjectId },
    );
  }

  async findById(id: string): Promise<Donation | null> {
    return this.donationModel.findById(id).exec();
  }

  async findAll(): Promise<Donation[]> {
    const donations = await this.donationModel
      .find({}, {}, { limit: 10 })
      .exec();

    return donations.map(
      (donation): Donation =>
        DonationMapper.toDomain(
          donation as Donation & { _id: import('mongoose').Types.ObjectId },
        ),
    );
  }

  async findAllPaginated(
    params: PaginationParams,
  ): Promise<PaginatedResult<Donation>> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    // Ensure skip is not negative
    const safeSkip = Math.max(0, skip);

    // Listagem publica exibe apenas solicitacoes ativas.
    // COMPLETED (encerradas manualmente ou via autoCompleteExpired) e
    // CANCELED nao devem aparecer em /solicitacoes.
    const activeFilter = {
      status: { $in: [DonationStatus.PENDING, DonationStatus.APPROVED] },
    };

    const [donations, total] = await Promise.all([
      this.donationModel
        .find(activeFilter)
        .skip(safeSkip)
        .limit(limit)
        .sort({ createdAt: -1, _id: -1 }) // Sort by createdAt first, then _id as fallback
        .exec(),
      this.donationModel.countDocuments(activeFilter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: donations.map(
        (donation): Donation =>
          DonationMapper.toDomain(
            donation as Donation & { _id: import('mongoose').Types.ObjectId },
          ),
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

  async findByUserId(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResult<Donation>> {
    const { page, limit } = params;
    const safeSkip = Math.max(0, (page - 1) * limit);

    const [donations, total] = await Promise.all([
      this.donationModel
        .find({ userId })
        .skip(safeSkip)
        .limit(limit)
        .sort({ createdAt: -1, _id: -1 })
        .exec(),
      this.donationModel.countDocuments({ userId }).exec(),
    ]);

    return {
      data: donations.map(
        (donation): Donation =>
          DonationMapper.toDomain(
            donation as Donation & { _id: import('mongoose').Types.ObjectId },
          ),
      ),
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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

  async autoCompleteExpired(now: Date = new Date()): Promise<number> {
    // finishDate e o ULTIMO dia valido: expira no dia seguinte, nao no inicio
    // do proprio finishDate. Comparar com o inicio do dia atual (00:00:00)
    // garante que solicitacoes com finishDate = hoje continuem ativas.
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const result = await this.donationModel
      .updateMany(
        {
          finishDate: { $exists: true, $ne: null, $lt: startOfToday },
          status: { $in: [DonationStatus.PENDING, DonationStatus.APPROVED] },
        },
        { $set: { status: DonationStatus.COMPLETED } },
      )
      .exec();

    return result.modifiedCount ?? 0;
  }
}
