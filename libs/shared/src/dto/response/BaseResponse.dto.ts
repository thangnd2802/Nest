import { HttpStatus } from '@nestjs/common';

export class BaseErrorDto {
  public message: string;
  public code?: string;
  constructor(message: string, code?: string) {
    this.message = message;
    this.code = code;
  }
}

export class BaseResponseDto<T> {
  public success: boolean;
  public data: T | null;
  public error?: BaseErrorDto;
  public status: HttpStatus;
  constructor(
    success: boolean,
    status: HttpStatus,
    data: T | null,
    error?: BaseErrorDto,
  ) {
    this.data = data;
    this.success = success;
    this.status = status;
    this.error = error;
  }

  public static internalError<T>(error: BaseErrorDto): BaseResponseDto<T> {
    return new BaseResponseDto<null>(
      true,
      HttpStatus.INTERNAL_SERVER_ERROR,
      null,
      error,
    );
  }

  public static success<T>(data: T, status: HttpStatus): BaseResponseDto<T> {
    return new BaseResponseDto<T>(true, status, data);
  }

  public static badRequest<T>(error?: BaseErrorDto): BaseResponseDto<T> {
    return new BaseResponseDto<T>(false, HttpStatus.BAD_REQUEST, null, error);
  }

  public static error(
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    error?: BaseErrorDto,
  ): BaseResponseDto<null> {
    return new BaseResponseDto(false, statusCode, null, error);
  }
}
