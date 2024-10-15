import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { HydratedDocument, Document } from 'mongoose';
import { DatabaseConstant } from '@nest-microservice/common/constants';
import { IUser } from '@nest-microservice/domain/entities/user/IUser';
import { UserGender } from '@nest-microservice/domain/enums/user.gender';
import { UserType } from '@nest-microservice/domain/enums/user.type';

export type UserDocument = HydratedDocument<User>;

@Schema({
  _id: false,
  versionKey: false,
  collection: DatabaseConstant.USER_TABLE_NAME,
})
export class User extends Document<unknown> implements IUser {
  @Prop({
    type: String,
    index: true,
    required: true,
    unique: true,
    default: uuidv4(),
  })
  id: string;
  @Prop({
    type: String,
    default: uuidv4(),
  })
  _id: string;
  @Prop({ type: String, unique: true, index: true })
  email: string;
  @Prop({ type: String })
  phone: string;
  @Prop({ type: String })
  firstName: string;
  @Prop({ type: String })
  lastName: string;
  @Prop({ type: Number, enum: UserGender })
  gender: UserGender;
  @Prop({ type: String })
  username?: string;
  @Prop({ type: Number, enum: UserType })
  type: UserType;
  @Prop({ type: String, unique: true })
  authId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
