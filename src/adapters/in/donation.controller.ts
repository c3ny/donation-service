import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import {
  Donation,
  DonationStatus,
} from 'src/application/core/domain/donation.entity';
import { DonationService } from 'src/application/core/service/donation.service';

@Controller('/donations')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post()
  async createDonation(@Body() donation: Omit<Donation, 'id'>) {
    return this.donationService.createDonation(donation);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() status: { status: DonationStatus },
  ) {
    return this.donationService.updateStatus(id, status.status);
  }
}
