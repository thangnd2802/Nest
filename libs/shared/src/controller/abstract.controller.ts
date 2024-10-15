import { HttpStatus, Res } from '@nestjs/common';
import { BaseResponseDto } from '../dto/response/BaseResponse.dto';
import { ServiceResult } from '../dto/response/ServiceResponse.dto';
import { Response } from 'express';
export abstract class BaseController {
  protected handleResponse<T>(
    @Res() res: Response,
    serviceResult: ServiceResult<T>,
  ): void {
    let responseDto: BaseResponseDto<T>;

    if (!serviceResult.success) {
      responseDto = BaseResponseDto.error(
        serviceResult.statusCode || HttpStatus.BAD_REQUEST,
        serviceResult.error,
      );
    } else {
      responseDto = BaseResponseDto.success(
        serviceResult.data,
        serviceResult.statusCode || HttpStatus.OK,
      );
    }
    res.status(responseDto.status).send(responseDto);
  }
}
