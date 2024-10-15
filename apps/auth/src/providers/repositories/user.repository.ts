import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { IUserRepository } from '../../users/IUser.repository';
import { User, UserDocument } from '../entities/user.schema';
import { IUser } from '../../users/IUser';

@Injectable()
export class MongoUserRepository implements IUserRepository {
  protected readonly logger = new Logger(MongoUserRepository.name);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<IUser | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByPhone(phone: string): Promise<IUser | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async create(user: Partial<IUser>): Promise<IUser> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser> {
    return await this.userModel
      .findOneAndUpdate({ id: id }, user, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }

  async findByEmailVerificationCode(
    emailVerificationCode: string,
  ): Promise<IUser | null> {
    return this.userModel
      .findOne({ emailVerificationCode: emailVerificationCode })
      .exec();
  }
}
