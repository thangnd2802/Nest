import { Injectable } from '@nestjs/common';
import { ILocalizationService } from './interfaces/ILocalizationService';

@Injectable()
export class LocalizationSingleton implements ILocalizationService {
  private static instance: LocalizationSingleton;
  private localizationService: ILocalizationService;
  private constructor() {}

  public static getInstance(): LocalizationSingleton {
    if (!LocalizationSingleton.instance) {
      LocalizationSingleton.instance = new LocalizationSingleton();
    }
    return LocalizationSingleton.instance;
  }

  public setLocalizationService(service: ILocalizationService): void {
    this.localizationService = service;
  }

  public translate(key: string, options?: any): string {
    if (!this.localizationService) {
      throw new Error('Localization service not set');
    }
    return this.localizationService.translate(key, options);
  }

  //   public setLanguage(lang: string): void {
  //     if (!this.localizationService) {
  //       throw new Error('Localization service not set');
  //     }
  //     this.localizationService.setLanguage(lang);
  //   }

  public getCurrentLanguage(): string {
    if (!this.localizationService) {
      throw new Error('Localization service not set');
    }
    return this.localizationService.getCurrentLanguage();
  }
}
