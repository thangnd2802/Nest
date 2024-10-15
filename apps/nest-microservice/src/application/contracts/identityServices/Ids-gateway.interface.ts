import {
  CreateIdsUserByEmailDto,
  CreateIdsUserByPhoneDto,
} from './dtos/request/create-ids-user.dto';
import { LoginIdsDto } from './dtos/request/login-ids.dto';
import { IdsServiceBaseResponseDto } from './dtos/response/ids-base.dto';
import { IdsEmailVerificationResponseDto } from './dtos/response/ids-email-verification.dto';
import { IdsGetGoogleOauthUrlResponseDto } from './dtos/response/ids-googleOauth-getUrl.dto';
import { IdsVerifyGoogleCodeResponseDto } from './dtos/response/ids-googleOauth-verifyCode.dto';
import { IdsLoginResponseDto } from './dtos/response/ids-login.dto';
import { IdsUserCreateResponseDto } from './dtos/response/ids-user-create.dto';
export interface IIdsGateway {
  createUserByEmail(
    payload: CreateIdsUserByEmailDto,
  ): Promise<IdsServiceBaseResponseDto<IdsUserCreateResponseDto>>;
  createUserByPhone(
    payload: CreateIdsUserByPhoneDto,
  ): Promise<IdsServiceBaseResponseDto<IdsUserCreateResponseDto>>;
  login(
    payload: LoginIdsDto,
  ): Promise<IdsServiceBaseResponseDto<IdsLoginResponseDto>>;
  verifyEmail(
    code: string,
  ): Promise<IdsServiceBaseResponseDto<IdsEmailVerificationResponseDto>>;
  getGoogleAuthorizationUrl(): Promise<
    IdsServiceBaseResponseDto<IdsGetGoogleOauthUrlResponseDto>
  >;
  verifyGoogleAuthCode(
    code: string,
  ): Promise<IdsServiceBaseResponseDto<IdsVerifyGoogleCodeResponseDto>>;
}
