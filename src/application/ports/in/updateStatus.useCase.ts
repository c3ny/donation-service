import { Inject, Injectable } from '@nestjs/common';
import {
  Donation,
  DonationStatus,
} from 'src/application/core/domain/donation.entity';
import { Result, ResultFactory } from 'src/types/result.types';
import { UseCase } from 'src/types/useCase.types';
import { DONATION_REPOSITORY } from 'src/constants';
import { DonationRepositoryPort } from '../out/donation-repostory.port';
import { ErrorsEnum } from 'src/application/core/errors/errors.enum';

export type UpdateStatusOutputType = {
  id: string;
  status: DonationStatus;
};

@Injectable()
export class UpdateStatusUseCase
  implements UseCase<UpdateStatusOutputType, Promise<Result<Donation>>>
{
  constructor(
    @Inject(DONATION_REPOSITORY) private repository: DonationRepositoryPort,
  ) {}

  async execute(input: UpdateStatusOutputType): Promise<Result<Donation>> {
    const donation = await this.repository.findById(input.id);

    if (!donation) {
      return ResultFactory.failure(ErrorsEnum.DonationNotFound);
    }

    const updatedDonation = await this.repository.updateStatus(
      input.id,
      input.status,
    );

    if (!updatedDonation) {
      return ResultFactory.failure(ErrorsEnum.DonationNotFound);
    }

    return ResultFactory.success(updatedDonation);
  }
}
