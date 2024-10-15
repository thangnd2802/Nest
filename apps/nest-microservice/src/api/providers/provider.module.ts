import { Module, Global } from '@nestjs/common';
import { ProviderConstant } from '../../common/constants';
import { IdsGatewayService } from '../../infrastructure/services/Ids-gateway.service';
import { AppDatabaseModule } from '@nest-microservice/infrastructure/Databases/database.module';
@Global()
@Module({
  imports: [AppDatabaseModule],
  providers: [
    {
      provide: ProviderConstant.IDS_GATEWAY,
      useClass: IdsGatewayService,
    },
  ],
  exports: [ProviderConstant.IDS_GATEWAY],
})
export class ProviderModule {}
