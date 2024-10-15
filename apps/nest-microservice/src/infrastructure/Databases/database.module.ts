import { Module, Global, Provider } from '@nestjs/common';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from '../entities/user.schema';
import { MongoDatabaseModule } from '@app/shared';
import { ProviderConstant } from '@nest-microservice/common/constants';
import { UserRepository } from '../repositories/user.repository';

function createModelProvider<T>(name: string): Provider {
  return {
    provide: name,
    useFactory: (model: Model<T>) => model,
    inject: [getModelToken(name)],
  };
}

@Global()
@Module({
  imports: [
    MongoDatabaseModule.forRoot(),
    MongoDatabaseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    createModelProvider<UserDocument>(User.name),
    {
      provide: ProviderConstant.USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [User.name, ProviderConstant.USER_REPOSITORY],
})
export class AppDatabaseModule {}
