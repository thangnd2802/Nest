import { UserGender } from '../../enums/user.gender';
import { UserType } from '../../enums/user.type';
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  gender: UserGender;
  email?: string;
  phone?: string;
  username?: string;
  type: UserType;
  authId: string;
}
