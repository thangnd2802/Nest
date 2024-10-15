export interface ILocalizationService {
  translate(key: string, options?: any): string;
  // setLanguage(lang: string): void;
  getCurrentLanguage(): string;
}
