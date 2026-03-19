import { Inject, Injectable } from '@nestjs/common';
import { Donation } from 'src/application/core/domain/donation.entity';
import { DONATION_REPOSITORY } from 'src/constants';
import { UseCase } from 'src/types/useCase.types';
import { Result, ResultFactory } from '../../../types/result.types';
import { DonationRepositoryPort } from 'src/application/ports/out/donation-repostory.port';
import {
  sanitizeContent,
  isValidContent,
} from 'src/application/core/utils/sanitize.util';
import { ErrorsEnum } from 'src/application/core/errors/errors.enum';

@Injectable()
export class CreateDonationUseCase
  implements UseCase<Donation, Promise<Result<Donation, ErrorsEnum>>>
{
  private resultFactory = new ResultFactory<Donation, ErrorsEnum>();

  constructor(
    @Inject(DONATION_REPOSITORY)
    private readonly donationRepository: DonationRepositoryPort,
  ) {}

  async execute(
    donation: Omit<Donation, 'id'>,
  ): Promise<Result<Donation, ErrorsEnum>> {
    console.log('🩸 Recebendo payload:', donation);
    Object.entries(donation).forEach(([key, value]) => {
      console.log(`   ➤ ${key}:`, typeof value, '| valor =', value);
    });

    // Campos que precisam de validação textual
    const camposInvalidos: string[] = [];
    const camposTextuais = ['name', 'phone', 'address', 'description'];

    for (const campo of camposTextuais) {
      const valor = (donation as any)[campo];
      if (valor && !isValidContent(valor)) {
        camposInvalidos.push(campo);
      }
    }

    if (camposInvalidos.length > 0) {
      console.log(
        '⚠️ Conteúdo inválido detectado nos campos:',
        camposInvalidos,
      );
      console.log('🧾 Dados recebidos (com erro):', donation);
      return this.resultFactory.failure(ErrorsEnum.InvalidContent);
    }

    // Sanitiza apenas campos textuais
    const sanitizedDonation = {
      ...donation,
      name: sanitizeContent(donation.name ?? ''),
      phone: sanitizeContent(donation.phone ?? ''),
      description: sanitizeContent(donation.description ?? ''),
    };

    console.log('✅ Conteúdo sanitizado:', sanitizedDonation);

    const savedDonation = await this.donationRepository.save(sanitizedDonation);

    return this.resultFactory.success(savedDonation);
  }
}
