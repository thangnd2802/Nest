import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ILocalizationService } from './interfaces/ILocalizationService';

@Injectable()
export class I18nLocalizationService implements ILocalizationService {
  constructor(private i18n: I18nService) {}

  translate(key: string, options?: any): string {
    return this.i18n.translate(key, options);
  }

  //   setLanguage(lang: string): void {
  //     // Implement language setting logic
  //   }

  getCurrentLanguage(): string {
    // Implement get current language logic
    return 'en'; // placeholder
  }
}
