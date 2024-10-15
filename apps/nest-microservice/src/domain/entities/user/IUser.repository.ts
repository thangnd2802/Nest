import { IUser } from './IUser';

export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByPhone(phone: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  create(user: Partial<IUser>): Promise<IUser>;
  update(id: string, user: Partial<IUser>): Promise<IUser>;
  delete(id: string): Promise<boolean>;
}
