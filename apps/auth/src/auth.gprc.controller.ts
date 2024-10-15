import { Controller, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import {
  RpcAuthServiceController,
  RpcAuthServiceControllerMethods,
  ValidateTokenRequest,
  ValidateTokenResponse,
} from '@app/grpc/proto/auth';

@Injectable()
@Controller()
@RpcAuthServiceControllerMethods()
export class AuthGrpcController implements RpcAuthServiceController {
  constructor(private readonly authService: AuthService) {}

  validateUserTokenRpc(
    request: ValidateTokenRequest,
  ):
    | ValidateTokenResponse
    | Observable<ValidateTokenResponse>
    | Promise<ValidateTokenResponse> {
    return this.authService.validateUserTokenRpc(request.token);
  }
}
