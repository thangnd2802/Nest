import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../config';
import { ConfigKeys } from '../constant/config-keys';

export class MongoDatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: MongoDatabaseModule,
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            uri: configService.get<string>(ConfigKeys.DATABASE_MONGO_URI),
          }),
          inject: [ConfigService],
        }),
      ],
      exports: [MongooseModule],
    };
  }

  static forFeature(models: ModelDefinition[]): DynamicModule {
    return {
      module: MongoDatabaseModule,
      imports: [MongooseModule.forFeature(models)],
      exports: [MongooseModule],
    };
  }
}
