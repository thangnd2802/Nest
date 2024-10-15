import { Module, Global, Provider } from '@nestjs/common';
import { HASH_SERVICE, USER_REPOSITORY } from '../constants';
import { HashService } from './services/hash.service';
import { MongoDatabaseModule } from '@app/shared';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from './entities/user.schema';
import { MongoUserRepository } from './repositories/user.repository';

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
    MongoDatabaseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    createModelProvider<UserDocument>(User.name),
    {
      provide: USER_REPOSITORY,
      useClass: MongoUserRepository,
    },
    {
      provide: HASH_SERVICE,
      useClass: HashService,
    },
  ],
  exports: [USER_REPOSITORY, HASH_SERVICE, User.name],
})
export class ProviderModule {}
