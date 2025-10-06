import { Result } from 'src/types/result.types';
import { RegistrationErrorsEnum } from '../application/core/errors/errors.enum';

export class RegistrationResultFactory {
  static failure<T>(
    error: RegistrationErrorsEnum,
  ): Result<T, RegistrationErrorsEnum> {
    return { isSuccess: false, error };
  }

  static success<T>(value: T): Result<T, RegistrationErrorsEnum> {
    return { isSuccess: true, value };
  }
}
