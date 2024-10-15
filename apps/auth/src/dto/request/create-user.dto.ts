import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class BaseCreateUserDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
export class CreateUserByEmailDto extends BaseCreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class CreateUserByPhoneDto extends BaseCreateUserDto {
  @IsString()
  @IsNotEmpty()
  phone: string;
}
