import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { BaseResponseDto } from '../shared/base-response.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { RpcException } from '@nestjs/microservices';
import { ResponseCodes } from '../constants/response-code';
import { LocalizationHelper } from '@app/shared/helpers/localization';

@Injectable()
export class GprcValidationPipe implements PipeTransform<any> {
  async transform(
    value: any,
    metadata: ArgumentMetadata,
  ): Promise<BaseResponseDto<any> | any> {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    for (const error of errors) {
      const contrainst = error.constraints;
      if (contrainst) {
        const code = ResponseCodes.ERROR.VALIDATION_ERROR;
        throw new RpcException(
          BaseResponseDto.error(
            code,
            LocalizationHelper.translateMessage(
              contrainst[Object.keys(contrainst)[0]],
            ),
          ),
        );
      }
    }

    return value;
  }
  /* eslint-disable @typescript-eslint/no-unsafe-function-type */
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
