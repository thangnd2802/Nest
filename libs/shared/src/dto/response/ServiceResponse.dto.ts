import { HttpStatus } from '@nestjs/common';

export interface ServiceResult<T = any> {
  data?: T;
  success: boolean;
  error?: {
    message: string;
    code?: string;
  };
  statusCode: HttpStatus;
}
