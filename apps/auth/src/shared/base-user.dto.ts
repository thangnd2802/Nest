import { IUser } from '../users/IUser';
import { BaseDto } from './base.dto';

export class BaseUserDto extends BaseDto<string> {
  public email: string;
  public phone: string;
  public username: string;
  public isEmailVerified: boolean;
  public phoneVerified: boolean;
  public updatedAt: Date;
  constructor(user: IUser) {
    super();
    this.id = user.id;
    this.email = user.email;
    this.phone = user.phone;
    this.username = user.username;
    this.isEmailVerified = user.isEmailVerified;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
