import {
  ExecutionContext,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  RPC_AUTH_SERVICE_NAME,
  RpcAuthServiceClient,
  ValidateTokenResponse,
} from '@app/grpc/proto/auth';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') implements OnModuleInit {
  private authGrpcService: RpcAuthServiceClient;

  constructor(
    private reflector: Reflector,
    // inject auth microservice grpc client
    @Inject(RPC_AUTH_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {
    super();
  }

  // init the auth grpc service after injecting the client in the constructor
  onModuleInit() {
    this.authGrpcService = this.client.getService<RpcAuthServiceClient>(
      RPC_AUTH_SERVICE_NAME,
    );
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    try {
      const decodedUser: ValidateTokenResponse = await firstValueFrom(
        this.authGrpcService.validateUserTokenRpc({
          token,
        }),
      );

      if (!decodedUser || !decodedUser.user) {
        return false;
      }

      request.user = decodedUser.user;

      return true;
    } catch (err) {
      console.log({ err });
      return false;
    }
  }
}
