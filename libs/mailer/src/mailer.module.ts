import { DynamicModule, Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from '@app/shared/constant/config-keys';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({})
export class MailerModule {
  static forRoot(templateDir: string): DynamicModule {
    return {
      module: MailerModule,
      imports: [
        NestMailerModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            transport: {
              host: configService.get<string>(ConfigKeys.MAIL_HOST),
              auth: {
                user: configService.get<string>(ConfigKeys.MAIL_USERNAME),
                pass: configService.get<string>(ConfigKeys.MAIL_PASSWORD),
              },
            },
            template: {
              dir: templateDir,
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [MailerService],
      exports: [MailerService],
    };
  }
}
