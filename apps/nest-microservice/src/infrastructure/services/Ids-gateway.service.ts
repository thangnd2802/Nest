import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProviderConstant } from '@nest-microservice/common/constants';
import { IIdsGateway } from '@nest-microservice/application/contracts/identityServices/Ids-gateway.interface';
import {
  CreateIdsUserByEmailDto,
  CreateIdsUserByPhoneDto,
} from '@nest-microservice/application/contracts/identityServices/dtos/request/create-ids-user.dto';
import { lastValueFrom } from 'rxjs';
import { IdsConstant } from '@nest-microservice/common/constants/Ids';
import { LoginIdsDto } from '@nest-microservice/application/contracts/identityServices/dtos/request/login-ids.dto';
import { IdsServiceBaseResponseDto } from '@nest-microservice/application/contracts/identityServices/dtos/response/ids-base.dto';
import { IdsUserCreateResponseDto } from '@nest-microservice/application/contracts/identityServices/dtos/response/ids-user-create.dto';
import { IdsLoginResponseDto } from '@nest-microservice/application/contracts/identityServices/dtos/response/ids-login.dto';
import { IdsEmailVerificationResponseDto } from '@nest-microservice/application/contracts/identityServices/dtos/response/ids-email-verification.dto';
import { IdsGetGoogleOauthUrlResponseDto } from '@nest-microservice/application/contracts/identityServices/dtos/response/ids-googleOauth-getUrl.dto';
import { IdsVerifyGoogleCodeResponseDto } from '@nest-microservice/application/contracts/identityServices/dtos/response/ids-googleOauth-verifyCode.dto';

@Injectable()
export class IdsGatewayService implements IIdsGateway {
  constructor(
    @Inject(ProviderConstant.AUTH_SERVICE)
    private readonly authClient: ClientProxy,
  ) {}

  async createUserByEmail(
    payload: CreateIdsUserByEmailDto,
  ): Promise<IdsServiceBaseResponseDto<IdsUserCreateResponseDto>> {
    const result: IdsServiceBaseResponseDto<IdsUserCreateResponseDto> =
      await lastValueFrom(
        this.authClient.send({ cmd: IdsConstant.LOGIN_USER }, payload),
      );
    return result;
  }

  async createUserByPhone(
    payload: CreateIdsUserByPhoneDto,
  ): Promise<IdsServiceBaseResponseDto<IdsUserCreateResponseDto>> {
    const result: IdsServiceBaseResponseDto<IdsUserCreateResponseDto> =
      await lastValueFrom(
        this.authClient.send(
          { cmd: IdsConstant.REGISTER_USER_BY_PHONE },
          payload,
        ),
      );
    return result;
  }

  async login(
    payload: LoginIdsDto,
  ): Promise<IdsServiceBaseResponseDto<IdsLoginResponseDto>> {
    const result = await lastValueFrom(
      this.authClient.send({ cmd: IdsConstant.LOGIN_USER }, payload),
    );
    return result;
  }

  async verifyEmail(
    code: string,
  ): Promise<IdsServiceBaseResponseDto<IdsEmailVerificationResponseDto>> {
    const result = await lastValueFrom(
      this.authClient.send({ cmd: IdsConstant.VERIFY_EMAIL }, code),
    );
    return result;
  }

  async getGoogleAuthorizationUrl(): Promise<
    IdsServiceBaseResponseDto<IdsGetGoogleOauthUrlResponseDto>
  > {
    const result = await lastValueFrom(
      this.authClient.send({ cmd: IdsConstant.GOOGLE_OAUTH }, {}),
    );
    return result;
  }

  async verifyGoogleAuthCode(
    code: string,
  ): Promise<IdsServiceBaseResponseDto<IdsVerifyGoogleCodeResponseDto>> {
    const result = await lastValueFrom(
      this.authClient.send({ cmd: IdsConstant.GOOGLE_OAUTH_REDIRECT }, code),
    );
    return result;
  }
}
