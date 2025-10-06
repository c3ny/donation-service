import { ResultFactory } from 'src/types/result.types';
import { RegistrationErrorsEnum } from '../application/core/errors/errors.enum';

export class RegistrationResultFactory<T> extends ResultFactory<
  T,
  RegistrationErrorsEnum
> {}
