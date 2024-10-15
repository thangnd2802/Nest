import { Global, Module } from '@nestjs/common';
import { ConfigModule as CommonConfigModule } from '@app/shared';
import { ClientsModule } from '@nestjs/microservices/module/clients.module';
import { Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME, RPC_AUTH_SERVICE_NAME } from '@app/grpc/proto/auth';
import * as path from 'path';
const AUTH_PROTO_FILE = '../../../libs/grpc/proto/auth.proto';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigKeys } from '@app/shared/constant/config-keys';
import { ControllerModule } from './controllers/v1/controller.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProviderModule } from './providers/provider.module';
import { ProviderConstant } from '../common/constants';
@Global()
@Module({
  imports: [
    CommonConfigModule,
    ClientsModule.registerAsync([
      {
        name: RPC_AUTH_SERVICE_NAME,
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: AUTH_PACKAGE_NAME,
            protoPath: path.join(__dirname, AUTH_PROTO_FILE),
            url: `${configService.get<string>(ConfigKeys.AUTH_SERVICE_HOST)}:${configService.get<number>(ConfigKeys.AUTH_SERVICE_GRPC_PORT)}`,
          },
        }),
        imports: [ConfigModule],
        inject: [ConfigService],
      },
      {
        name: ProviderConstant.AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>(ConfigKeys.AUTH_SERVICE_HOST),
            port: configService.get<number>(ConfigKeys.AUTH_SERVICE_TCP_PORT),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ProviderModule,
    ControllerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ClientsModule],
})
export class AppModule {}
