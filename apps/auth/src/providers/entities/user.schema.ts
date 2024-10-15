import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { HydratedDocument, Document } from 'mongoose';
import { USER_TABLE_NAME } from '../../constants';
import { IUser } from '../../users/IUser';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, collection: USER_TABLE_NAME })
export class User extends Document<unknown> implements IUser {
  @Prop({ type: String, required: true, unique: true, default: uuidv4() })
  id: string;

  @Prop({ type: String, default: uuidv4() })
  _id: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop({ type: Boolean, default: false })
  isPhoneVerified: boolean;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: String })
  emailVerificationCode: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
