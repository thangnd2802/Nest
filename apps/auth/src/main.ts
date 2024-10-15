import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from '@app/grpc/proto/auth';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from '@app/shared/constant/config-keys';
import * as cookieParser from 'cookie-parser';
const AUTH_PROTO_FILE = '../../libs/grpc/proto/auth.proto';

async function bootstrap() {
  // create hybrid app

  // create http server
  const app = await NestFactory.create(AuthModule, { bufferLogs: true });

  const configService = app.get(ConfigService);
  // connect microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      protoPath: path.join(__dirname, AUTH_PROTO_FILE),
      package: AUTH_PACKAGE_NAME,
      url: `${configService.get<string>(ConfigKeys.AUTH_SERVICE_HOST)}:${configService.get<number>(ConfigKeys.AUTH_SERVICE_GRPC_PORT)}`,
    },
  });

  // TCP setup for signIn and signUp
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: configService.get<string>(ConfigKeys.AUTH_SERVICE_HOST),
      port: configService.get<number>(ConfigKeys.AUTH_SERVICE_TCP_PORT),
    },
  });
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5500', // Adjust according to your front-end origin
    credentials: true, // Allows sending cookies in cross-origin requests
  });
  const PORT = configService.get<number>(ConfigKeys.AUTH_SERVICE_PORT);
  await app.startAllMicroservices();
  await app.listen(PORT);
}
bootstrap();
