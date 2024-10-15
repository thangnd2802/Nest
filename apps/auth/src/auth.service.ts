import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ValidateTokenResponse } from '@app/grpc/proto/auth';
import {
  CreateUserByEmailDto,
  CreateUserByPhoneDto,
} from './dto/request/create-user.dto';
import { IUser } from './users/IUser';
import { AuthResponseDto } from './dto/response/auth.dto';
import { BaseResponseDto } from './shared/base-response.dto';
import { ResponseCodes } from './constants/response-code';
import { MailerService } from '@app/mailer';
import { IEmailVerificationContext } from './mails/interfaces/IEmailVerificationContext';
import { LocalizationHelper } from '@app/shared/helpers/localization';
import { ConfigService } from '@nestjs/config';
import {
  HASH_SERVICE,
  LangConstant,
  MailTemplates,
  USER_REPOSITORY,
} from './constants';
import { ConfigKeys } from '@app/shared/constant/config-keys';
import { v4 as uuidv4 } from 'uuid';
import { IUserRepository } from './users/IUser.repository';
import { IHash } from './contracts/IHash';
import { BaseDto } from './shared/base.dto';
import axios from 'axios';
import { VerifyGoogleCodeResponseDto } from './dto/response/googleVerifyCode.dto';
import { generateRandomPassword } from './shared/utils';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private mailService: MailerService,
    private configService: ConfigService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(HASH_SERVICE)
    private readonly hashService: IHash,
  ) {}

  async generateToken(user: IUser): Promise<string> {
    const payload = { userId: user.id };
    return this.jwtService.signAsync(payload);
  }

  async signIn(
    phone: string,
    password: string,
  ): Promise<BaseResponseDto<AuthResponseDto>> {
    const user = await this.userRepository.findByPhone(phone);
    if (!user || !user.isVerified) {
      return BaseResponseDto.error(ResponseCodes.ERROR.INVALID_CREDENTIALS);
    }
    const isPasswordValid = await this.hashService.comparePasswords(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      return BaseResponseDto.error(ResponseCodes.ERROR.INVALID_CREDENTIALS);
    }
    const response: AuthResponseDto = {
      accessToken: await this.generateToken(user),
    };
    return BaseResponseDto.success<AuthResponseDto>(
      response,
      ResponseCodes.SUCCESS.AUTH_SUCCESS,
    );
  }

  async registerByPhone(
    payload: CreateUserByPhoneDto,
  ): Promise<BaseResponseDto<BaseDto<string>>> {
    const { phone } = payload;
    const user = await this.userRepository.findByPhone(phone);
    if (user) {
      return BaseResponseDto.error(ResponseCodes.ERROR.USER_ALREADY_EXISTS);
    }
    payload.password = await this.hashService.hashPassword(payload.password);
    const created_user = await this.userRepository.create(payload);
    const response: BaseDto<string> = {
      id: created_user.id,
      createdAt: created_user.createdAt,
    };
    return BaseResponseDto.success<BaseDto<string>>(
      response,
      ResponseCodes.SUCCESS.USER_CREATED,
    );
  }

  async registerByEmail(
    payload: CreateUserByEmailDto,
  ): Promise<BaseResponseDto<BaseDto<string>>> {
    const { email } = payload;

    const user = await this.userRepository.findByEmail(email);
    if (user && user.isEmailVerified) {
      return BaseResponseDto.error(ResponseCodes.ERROR.USER_ALREADY_EXISTS);
    }

    const verificationCode = uuidv4();

    const verificationLink = `${this.configService.get<string>(ConfigKeys.API_GATEWAY_URL)}${this.configService.get<string>(ConfigKeys.API_GATEWAY_EMAIL_VERIFICATION)}${verificationCode}`;

    const email_verification_context: IEmailVerificationContext = {
      verificationLink: verificationLink,
    };

    const createUserPayload = {
      ...payload,
      isEmailVerified: false,
      emailVerificationCode: verificationCode,
    };

    const created_user = await this.userRepository.create(createUserPayload);

    this.mailService.sendMail({
      to: email,
      subject: LocalizationHelper.translateMessage(
        LangConstant.MAIL_REGISTER_SUBJECT,
      ),
      template: MailTemplates.MAIL_VERIFICATION,
      context: email_verification_context,
    });
    const response: BaseDto<string> = {
      id: created_user.id,
      createdAt: created_user.createdAt,
    };
    return BaseResponseDto.success<BaseDto<string>>(
      response,
      ResponseCodes.SUCCESS.USER_CREATED,
    );
  }

  async verifyEmail(verificationCode: string): Promise<BaseResponseDto<IUser>> {
    const user =
      await this.userRepository.findByEmailVerificationCode(verificationCode);
    if (!user || user.isEmailVerified) {
      return BaseResponseDto.error(ResponseCodes.ERROR.NOT_FOUND);
    }
    user.isEmailVerified = true;
    user.emailVerificationCode = null;
    user.isVerified = true;
    const updatedUser = await this.userRepository.update(user.id, user);
    return BaseResponseDto.success<IUser>(
      updatedUser,
      ResponseCodes.SUCCESS.BASE_SUCESS,
    );
  }

  async getGoogleAuthorizationUrl(): Promise<BaseResponseDto<{ url: string }>> {
    const clientID = this.configService.get<string>(
      ConfigKeys.GOOGLE_OAUTH_CLIENT_ID,
    );
    const redirectUri = this.configService.get<string>(
      ConfigKeys.GOOGLE_OAUTH_CALLBACK_URL,
    );
    const scope = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' ');
    const baseUrl = this.configService.get<string>(
      ConfigKeys.GOOGLE_OAUTH_AUTHORIZATION_URL,
    );
    const authUrl = `${baseUrl}&client_id=${clientID}&redirect_uri=${redirectUri}&scope=${scope}`;
    return BaseResponseDto.success<{ url: string }>(
      { url: authUrl },
      ResponseCodes.SUCCESS.BASE_SUCESS,
    );
  }

  async fetchGoogleProfile(accessToken: string) {
    try {
      const userInfoUrl = this.configService.get<string>(
        ConfigKeys.GOOGLE_OAUTH_USERINFO_URL,
      );
      const response = await axios.get(userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch {
      return null;
    }
  }

  async verifyGoogleAuthCode(code: string) {
    const clientSecret = this.configService.get<string>(
      ConfigKeys.GOOGLE_OAUTH_CLIENT_SECRET,
    );
    const clientID = this.configService.get<string>(
      ConfigKeys.GOOGLE_OAUTH_CLIENT_ID,
    );
    const redirectUri = this.configService.get<string>(
      ConfigKeys.GOOGLE_OAUTH_CALLBACK_URL,
    );
    const tokenUrl = this.configService.get<string>(
      ConfigKeys.GOOGLE_OAUTH_TOKEN_URL,
    );
    try {
      // Exchange authorization code for access token
      const response = await axios.post(tokenUrl, null, {
        params: {
          code,
          client_id: clientID,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const { access_token } = response.data;
      const userInfo = await this.fetchGoogleProfile(access_token);
      if (!userInfo) {
        return BaseResponseDto.error(ResponseCodes.ERROR.AUTH_FAILED);
      }
      let user = await this.userRepository.findByEmail(userInfo.email);
      let isNewUser = false;
      if (!user) {
        const createUserPayload: Partial<IUser> = {
          email: userInfo.email,
          isEmailVerified: true,
          isVerified: true,
          password: await this.hashService.hashPassword(
            generateRandomPassword(),
          ),
        };
        // todo: maybe send email to user with password
        user = await this.userRepository.create(createUserPayload);
        isNewUser = true;
      } else {
        user.isVerified = true;
        user.isEmailVerified = true;
        await this.userRepository.update(user.id, user);
      }
      const token = await this.generateToken(user);
      return BaseResponseDto.success<VerifyGoogleCodeResponseDto>(
        { accessToken: token, authId: user.id, isNewUser, ...userInfo },
        ResponseCodes.SUCCESS.AUTH_SUCCESS,
      );
    } catch {
      return BaseResponseDto.error(ResponseCodes.ERROR.INVALID_CREDENTIALS);
    }
  }

  async validateUserTokenRpc(token: string): Promise<ValidateTokenResponse> {
    if (!token) {
      return {
        empty: {},
      };
    }
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      if (!decoded) {
        return {
          empty: {},
        };
      }

      return {
        user: {
          userId: decoded.userId,
        },
      };
    } catch {
      return {
        empty: {},
      };
    }
  }
}
