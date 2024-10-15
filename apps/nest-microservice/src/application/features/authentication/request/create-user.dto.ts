import { UserGender } from 'apps/nest-microservice/src/domain/enums/user.gender';

// import { UserGender } from '@domain/enums/user.gender';
export class CreateUserRequestDto {
  firstName: string;
  lastName: string;
  gender: UserGender;
  email?: string;
  phone?: string;
  username?: string;
}
