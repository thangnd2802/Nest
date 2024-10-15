import { Controller, UseFilters, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateUserByEmailDto,
  CreateUserByPhoneDto,
} from './dto/request/create-user.dto';
import { AuthRequestDto } from './dto/request/auth.dto';
import { GprcValidationPipe } from './pipes/rpc-validation';
import { CustomRpcExceptionFilter } from './exceptions/rpc-exception.filter';
import { AuthMessagePattern } from './constants';

@Controller()
@UseFilters(new CustomRpcExceptionFilter())
@UsePipes(new GprcValidationPipe())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: AuthMessagePattern.LOGIN_USER })
  async signIn(@Payload() signInDto: AuthRequestDto) {
    return await this.authService.signIn(signInDto.phone, signInDto.password);
  }

  @MessagePattern({ cmd: AuthMessagePattern.REGISTER_USER_BY_PHONE })
  async signUpByPhone(@Payload() signUpDto: CreateUserByPhoneDto) {
    return this.authService.registerByPhone(signUpDto);
  }

  @MessagePattern({ cmd: AuthMessagePattern.REGISTER_USER_BY_EMAIL })
  async signUpByEmail(@Payload() signUpDto: CreateUserByEmailDto) {
    return this.authService.registerByEmail(signUpDto);
  }

  @MessagePattern({ cmd: AuthMessagePattern.VERIFY_EMAIL })
  async verifyEmail(@Payload() emailVerificationCode: string) {
    return this.authService.verifyEmail(emailVerificationCode);
  }

  @MessagePattern({ cmd: AuthMessagePattern.GOOGLE_OAUTH })
  async getGoogleAuthorizationUrl() {
    return this.authService.getGoogleAuthorizationUrl();
  }

  @MessagePattern({ cmd: AuthMessagePattern.GOOGLE_OAUTH_REDIRECT })
  async verifyGoogleAuthCode(@Payload() code: string) {
    return this.authService.verifyGoogleAuthCode(code);
  }
}
