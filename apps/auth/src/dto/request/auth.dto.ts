import { IsString, MinLength } from 'class-validator';

export class AuthRequestDto {
  @IsString()
  @MinLength(10, {
    message: 'validation.INVALID_PHONE_FORMAT',
  })
  public phone: string;
  public password: string;
}
