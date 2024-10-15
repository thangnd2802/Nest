import { HttpStatus } from '@nestjs/common';

export class Result<T = null> {
  public success: boolean;
  public message: string;
  public error?: string;
  public errorCode?: string;
  public statusCode?: HttpStatus;
  public data?: T;
  constructor(
    success: boolean,
    message: string,
    statusCode: HttpStatus,
    data: T | null = null,
    error?: string,
    errorCode?: string,
  ) {
    this.success = success;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
    this.error = error;
    this.errorCode = errorCode;
  }

  public static ok<T>(message: string, data: T): Result<T> {
    return new Result(true, message, HttpStatus.OK, data);
  }

  public static success<T>(
    message: string,
    status: HttpStatus,
    data: T,
  ): Result<T> {
    return new Result(true, message, status, data);
  }

  public static badRequest(message: string): Result {
    return new Result(false, message, HttpStatus.BAD_REQUEST);
  }

  public static fail(message: string, status: HttpStatus): Result {
    return new Result(false, message, status);
  }

  public static serverError(message: string): Result {
    return new Result(false, message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
