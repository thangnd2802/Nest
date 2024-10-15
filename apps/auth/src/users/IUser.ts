export interface IUser {
  id: string;
  email?: string;
  phone?: string;
  username?: string;
  isVerified: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  emailVerificationCode: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
