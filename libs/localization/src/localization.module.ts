import { DynamicModule, Global, Module } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule, I18nOptions } from 'nestjs-i18n';
import { ILocalizationService } from './interfaces/ILocalizationService';
import { I18nLocalizationService } from './i18n-localiztion.service';
import { LocalizationSingleton } from './localization.singleton';

export const LOCALIZATION_SERVICE = 'ILocalizationService';

@Global()
@Module({})
export class LocalizationModule {
  static forRoot(options: I18nOptions): DynamicModule {
    return {
      module: LocalizationModule,
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: options.fallbackLanguage || 'en',
          resolvers: [AcceptLanguageResolver],
          ...options,
        }),
      ],
      providers: [
        {
          provide: LOCALIZATION_SERVICE,
          useClass: I18nLocalizationService,
        },
        {
          provide: LocalizationSingleton,
          useFactory: (localizationService: ILocalizationService) => {
            const instance = LocalizationSingleton.getInstance();
            instance.setLocalizationService(localizationService);
            return instance;
          },
          inject: [LOCALIZATION_SERVICE],
        },
      ],
      exports: [LocalizationSingleton],
    };
  }
}
