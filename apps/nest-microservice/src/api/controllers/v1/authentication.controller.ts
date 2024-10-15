import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from 'apps/nest-microservice/src/application/features/authentication/authentication.service';
import { LoginDto } from 'apps/nest-microservice/src/application/features/authentication/request/login.dto';
import { CreateUserRequestDto } from 'apps/nest-microservice/src/application/features/authentication/request/create-user.dto';
import { Response } from 'express';
import { Result } from '@nest-microservice/common/Result';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getActionResutl(res: Response, result: Result<any>) {
    res.status(result.statusCode).send(result.data);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.signIn(loginDto);
    this.getActionResutl(res, result);
  }

  @Post('phoneSignUp')
  async phoneSignUp(
    @Body() signUpDto: CreateUserRequestDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.signUpByPhone(signUpDto);
    this.getActionResutl(res, result);
  }

  @Post('emailSignUp')
  async emailSignUp(
    @Body() signUpDto: CreateUserRequestDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.signUpByEmail(signUpDto);
    this.getActionResutl(res, result);
  }

  @Get('verifyEmail')
  async verifyEmail(
    @Query('code') emailVerificationCode: string,
    @Res() res: Response,
  ) {
    const result = await this.authService.verifyEmail(emailVerificationCode);
    this.getActionResutl(res, result);
  }

  @Get('google')
  async googleAuth(
    @Query('redirect_uri') redirectUri: string,
    @Res() res: Response,
  ) {
    const result = await this.authService.googleAuth();
    const redirectUrl = `${(result.data as any).url}&state=${redirectUri}`;
    res.redirect(redirectUrl);
    return;
  }

  @Get('google/callback')
  async googleAuthRedirect(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    const result = await this.authService.googleAuthCallback(code);
    if (result.success) {
      res.cookie('auth_token', result.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 1000,
      });
      res.redirect(state);
    }
    return;
  }
}
