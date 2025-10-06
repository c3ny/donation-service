import { ErrorsEnum } from '../application/core/errors/errors.enum';

export type PartialSuccessResult<T> = {
  isSuccess: true;
  value: T;
  error?: undefined;
  isPartialSuccess: true;
};

export type SuccessResult<T> = {
  isSuccess: true;
  value: T;
  error?: undefined;
  isPartialSuccess?: false;
};

export type FailureResult<E = ErrorsEnum> = {
  isSuccess: false;
  value?: undefined;
  error: E;
  isPartialSuccess?: false;
};

export type Result<T, E = ErrorsEnum> =
  | SuccessResult<T>
  | PartialSuccessResult<T>
  | FailureResult<E>;

export class ResultFactory {
  static success<T>(value: T): Result<T> {
    return { isSuccess: true, value };
  }

  static failure<T, E = ErrorsEnum>(error: E): Result<T, E> {
    return { isSuccess: false, error };
  }

  static partialSuccess<T>(value: T): Result<T> {
    return { isSuccess: true, value, isPartialSuccess: true };
  }
}
