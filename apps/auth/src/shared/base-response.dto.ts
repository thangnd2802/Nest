import { LocalizationHelper } from '@app/shared/helpers/localization';
import { ResponseMessage } from '../constants/response-message';

export class BaseResponseDto<T> {
  public data: T;
  public code: string;
  public message: string;
  public success: boolean;

  constructor(data: T, code: string, success: boolean, message?: string) {
    this.data = data;
    this.code = code;
    this.success = success;
    this.message =
      message ?? LocalizationHelper.translateMessage(ResponseMessage[code]);
  }

  public static success<T>(data: T, code: string): BaseResponseDto<T> {
    return new BaseResponseDto<T>(data, code, true);
  }

  public static error(code: string, message?: string): BaseResponseDto<null> {
    return new BaseResponseDto(null, code, false, message);
  }
}
