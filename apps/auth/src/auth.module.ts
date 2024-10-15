import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGrpcController } from './auth.gprc.controller';
import {
  ConfigModule as CommonConfigModule,
  MongoDatabaseModule,
} from '@app/shared';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigKeys } from '@app/shared/constant/config-keys';
import * as path from 'path';
import { LocalizationModule } from '@app/localization';
import { ProviderModule } from './providers/provider.module';
import { MailerModule } from '@app/mailer';
import { PassportModule } from '@nestjs/passport';
import { GOOGLE_OAUTH_STRATEGY } from './constants';

@Module({
  imports: [
    LocalizationModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
    }),
    PassportModule.register({ defaultStrategy: GOOGLE_OAUTH_STRATEGY }),
    CommonConfigModule,
    MongoDatabaseModule.forRoot(),
    MailerModule.forRoot(path.join(__dirname, '/mails/templates')),
    ProviderModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(ConfigKeys.JWT_SECRET),
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, AuthGrpcController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
