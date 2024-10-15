import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { ResponseCodes } from '../constants/response-code';
import { BaseResponseDto } from '../shared/base-response.dto';

@Catch(RpcException)
export class CustomRpcExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const errorResponse = exception.getError();
    let responseBody: BaseResponseDto<any>;
    // If the error response is already in BaseResponseDto format, use it
    if (errorResponse instanceof BaseResponseDto) {
      responseBody = errorResponse;
    } else {
      responseBody = BaseResponseDto.error(
        ResponseCodes.ERROR.INTERNAL_SERVER_ERROR,
      );
    }
    return throwError(() => responseBody);
  }
}
