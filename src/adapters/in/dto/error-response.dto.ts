import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Standard error response DTO for the Donation Service API.
 * Follows NestJS HTTP exception format and provides consistent error structure.
 */
export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
    type: 'number',
    minimum: 100,
    maximum: 599,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message or error code',
    example: 'DONATION_NOT_FOUND',
    type: 'string',
  })
  message: string | string[];

  @ApiPropertyOptional({
    description: 'Additional error details or context',
    example: 'The donation with ID 67123abc456def789012 was not found',
    type: 'string',
  })
  error?: string;

  @ApiPropertyOptional({
    description: 'Timestamp when the error occurred',
    example: '2025-10-17T14:30:00.000Z',
    format: 'date-time',
  })
  timestamp?: string;

  @ApiPropertyOptional({
    description: 'API endpoint where the error occurred',
    example: '/donations/67123abc456def789012',
    type: 'string',
  })
  path?: string;
}

/**
 * Validation error response DTO for detailed field validation errors.
 * Used when request validation fails with multiple field errors.
 */
export class ValidationErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code for validation errors',
    example: 400,
    type: 'number',
  })
  declare statusCode: 400;

  @ApiProperty({
    description: 'Array of validation error messages',
    example: [
      'content should not be empty',
      'bloodType must be a valid enum value',
      'location.latitude must be a number',
    ],
    type: [String],
  })
  declare message: string[];

  @ApiProperty({
    description: 'Error type identifier',
    example: 'Bad Request',
    type: 'string',
  })
  declare error: 'Bad Request';
}

/**
 * Unauthorized error response DTO for authentication failures.
 */
export class UnauthorizedErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code for unauthorized access',
    example: 401,
    type: 'number',
  })
  declare statusCode: 401;

  @ApiProperty({
    description: 'Unauthorized access message',
    example: 'Unauthorized',
    type: 'string',
  })
  declare message: 'Unauthorized';

  @ApiProperty({
    description: 'Error type identifier',
    example: 'Unauthorized',
    type: 'string',
  })
  declare error: 'Unauthorized';
}

/**
 * Forbidden error response DTO for authorization failures.
 */
export class ForbiddenErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code for forbidden access',
    example: 403,
    type: 'number',
  })
  declare statusCode: 403;

  @ApiProperty({
    description: 'Forbidden access message',
    example: 'Forbidden resource',
    type: 'string',
  })
  declare message: string;

  @ApiProperty({
    description: 'Error type identifier',
    example: 'Forbidden',
    type: 'string',
  })
  declare error: 'Forbidden';
}

/**
 * Not found error response DTO for resource not found errors.
 */
export class NotFoundErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code for resource not found',
    example: 404,
    type: 'number',
  })
  declare statusCode: 404;

  @ApiProperty({
    description: 'Resource not found message',
    example: 'Donation not found',
    type: 'string',
  })
  declare message: string;

  @ApiProperty({
    description: 'Error type identifier',
    example: 'Not Found',
    type: 'string',
  })
  declare error: 'Not Found';
}

/**
 * Conflict error response DTO for resource conflicts.
 */
export class ConflictErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code for resource conflicts',
    example: 409,
    type: 'number',
  })
  declare statusCode: 409;

  @ApiProperty({
    description: 'Conflict message',
    example: 'User already registered for this donation',
    type: 'string',
  })
  declare message: string;

  @ApiProperty({
    description: 'Error type identifier',
    example: 'Conflict',
    type: 'string',
  })
  declare error: 'Conflict';
}

/**
 * Internal server error response DTO for server-side errors.
 */
export class InternalServerErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code for internal server errors',
    example: 500,
    type: 'number',
  })
  declare statusCode: 500;

  @ApiProperty({
    description: 'Internal server error message',
    example: 'Internal server error',
    type: 'string',
  })
  declare message: 'Internal server error';

  @ApiProperty({
    description: 'Error type identifier',
    example: 'Internal Server Error',
    type: 'string',
  })
  declare error: 'Internal Server Error';
}

/**
 * Common error response examples for API documentation.
 */
export const ErrorResponseExamples = {
  BadRequest: {
    summary: 'Bad Request',
    description: 'Invalid request data or validation errors',
    value: {
      statusCode: 400,
      message: 'DONATION_NOT_FOUND',
      error: 'Bad Request',
      timestamp: '2025-10-17T14:30:00.000Z',
      path: '/donations/invalid-id',
    },
  },
  Unauthorized: {
    summary: 'Unauthorized',
    description: 'Missing or invalid authentication token',
    value: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized',
      timestamp: '2025-10-17T14:30:00.000Z',
      path: '/donations',
    },
  },
  Forbidden: {
    summary: 'Forbidden',
    description: 'Insufficient permissions to access resource',
    value: {
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden',
      timestamp: '2025-10-17T14:30:00.000Z',
      path: '/donations/67123abc456def789012',
    },
  },
  NotFound: {
    summary: 'Not Found',
    description: 'Resource not found',
    value: {
      statusCode: 404,
      message: 'Donation not found',
      error: 'Not Found',
      timestamp: '2025-10-17T14:30:00.000Z',
      path: '/donations/67123abc456def789012',
    },
  },
  Conflict: {
    summary: 'Conflict',
    description: 'Resource conflict (e.g., duplicate registration)',
    value: {
      statusCode: 409,
      message: 'User already registered for this donation',
      error: 'Conflict',
      timestamp: '2025-10-17T14:30:00.000Z',
      path: '/registrations',
    },
  },
  ValidationError: {
    summary: 'Validation Error',
    description: 'Request validation failed with field errors',
    value: {
      statusCode: 400,
      message: [
        'content should not be empty',
        'bloodType must be a valid enum value',
        'location.latitude must be a number',
      ],
      error: 'Bad Request',
      timestamp: '2025-10-17T14:30:00.000Z',
      path: '/donations',
    },
  },
  InternalServerError: {
    summary: 'Internal Server Error',
    description: 'Unexpected server error',
    value: {
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error',
      timestamp: '2025-10-17T14:30:00.000Z',
      path: '/donations',
    },
  },
} as const;
