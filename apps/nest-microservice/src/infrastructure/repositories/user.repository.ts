import { IUserRepository } from '@nest-microservice/domain/entities/user/IUser.repository';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../entities/user.schema';
import { Model } from 'mongoose';
import { IUser } from '@nest-microservice/domain/entities/user/IUser';

export class UserRepository implements IUserRepository {
  protected readonly logger = new Logger(UserRepository.name);
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
    return this.userModel.findOneAndUpdate({ id }, user, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    return (await this.userModel.deleteOne({ id }).exec()).deletedCount === 1;
  }
}
