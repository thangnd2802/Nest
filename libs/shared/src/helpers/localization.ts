import { LocalizationSingleton } from '@app/localization';

export class LocalizationHelper {
  public static translateMessage(code: string): string {
    const localization = LocalizationSingleton.getInstance();
    return localization.translate(code);
  }
}
