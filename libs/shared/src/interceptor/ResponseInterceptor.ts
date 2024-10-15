import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponseDto } from '../dto/response/BaseResponse.dto';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, BaseResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<BaseResponseDto<T>> {
    return next.handle().pipe(
      map((data: T) => {
        // Extract the HTTP response object
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();

        // Create the response object
        const baseResponse: BaseResponseDto<T> = {
          success: false,
          data,
          error: null,
          status: HttpStatus.OK, // Default status
        };

        // If the response data contains a status property, use it
        if (data && (data as any).status) {
          baseResponse.status = (data as any).status;
          response.status(baseResponse.status); // Set the HTTP status code
        } else {
          response.status(baseResponse.status); // Set default HTTP status code
        }

        return baseResponse;
      }),
    );
  }
}
