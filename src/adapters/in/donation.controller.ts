import { Body, Controller, Post } from '@nestjs/common';
import { Donation } from 'src/application/core/domain/donation.entity';
import { DonationService } from 'src/application/core/service/donation.service';

@Controller('/donations')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post()
  async createDonation(@Body() donation: Omit<Donation, 'id'>) {
    return this.donationService.createDonation(donation);
  }
}
