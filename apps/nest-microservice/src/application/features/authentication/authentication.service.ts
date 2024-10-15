import { Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './request/login.dto';
import { AuthResponseDto } from './response/auth-response.dto';
import { CreateUserResponseDto } from './response/create-user.dto';
import { CreateUserRequestDto } from './request/create-user.dto';
import { ProviderConstant } from '@nest-microservice/common/constants';
import { IIdsGateway } from '@nest-microservice/application/contracts/identityServices/Ids-gateway.interface';
import {
  CreateIdsUserByEmailDto,
  CreateIdsUserByPhoneDto,
} from '@nest-microservice/application/contracts/identityServices/dtos/request/create-ids-user.dto';
import { retry } from '@app/shared';
import { IUserRepository } from '@nest-microservice/domain/entities/user/IUser.repository';
import { IUser } from '@nest-microservice/domain/entities/user/IUser';
import { Result } from '@nest-microservice/common/Result';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ProviderConstant.IDS_GATEWAY)
    private readonly idsService: IIdsGateway,
    @Inject(ProviderConstant.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async signIn(loginDto: LoginDto): Promise<Result<AuthResponseDto>> {
    const result = await this.idsService.login(loginDto);
    if (result.success) {
      return Result.ok<AuthResponseDto>('success', result.data);
    } else {
      return Result.badRequest(result.message);
    }
  }

  async signUpByPhone(
    payload: CreateUserRequestDto,
  ): Promise<Result<CreateUserResponseDto>> {
    const ids_payload: CreateIdsUserByPhoneDto = {
      phone: payload.phone,
      password: '123456',
    };
    const result = await this.idsService.createUserByPhone(ids_payload);
    if (result.success) {
      return Result.ok('success', result.data);
    } else {
      return Result.badRequest(result.message);
    }
  }

  async signUpByEmail(
    payload: CreateUserRequestDto,
  ): Promise<Result<CreateUserResponseDto>> {
    const user = await this.userRepository.findByEmail(payload.email);
    if (user && user.authId) {
      return Result.badRequest('User existed');
    }
    const ids_payload: CreateIdsUserByEmailDto = {
      email: payload.email,
      password: 'asdasddas',
    };
    const result = await retry(() =>
      this.idsService.createUserByEmail(ids_payload),
    );
    if (result.success) {
      return Result.ok('success', result.data);
    } else {
      return Result.badRequest(result.message);
    }
  }

  async verifyEmail(code: string): Promise<Result<CreateUserResponseDto>> {
    const result = await retry(() => this.idsService.verifyEmail(code));
    if (result.success) {
      const user = await this.userRepository.findByEmail(result.data.email);
      if (!user) {
        const createUserPayload: Partial<IUser> = {
          email: result.data.email,
          authId: result.data.id,
        };
        await this.userRepository.create(createUserPayload);
      } else if (!user.authId) {
        user.authId = result.data.id;
        await this.userRepository.update(user.id, user);
      }
      return Result.ok('success', result.data);
    } else {
      return Result.badRequest(result.message);
    }
  }

  async googleAuth() {
    const result = await this.idsService.getGoogleAuthorizationUrl();
    if (result.success) {
      return Result.ok('success', result.data);
    } else {
      return Result.badRequest(result.message);
    }
  }

  async googleAuthCallback(code: string) {
    const result = await this.idsService.verifyGoogleAuthCode(code);
    if (result.success) {
      if (result.data.isNewUser) {
        const user = await this.userRepository.findByEmail(result.data.email);
        if (!user) {
          const createUserPayload: Partial<IUser> = {
            email: result.data.email,
            authId: result.data.authId,
          };
          await this.userRepository.create(createUserPayload);
        } else if (!user.authId) {
          user.authId = result.data.authId;
          await this.userRepository.update(user.id, user);
        }
      }
      return Result.ok('success', result.data);
    } else {
      return Result.badRequest(result.message);
    }
  }
}
