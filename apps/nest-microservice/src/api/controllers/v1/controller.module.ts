import { Module } from '@nestjs/common';
import { AuthController } from './authentication.controller';
import { AuthService } from 'apps/nest-microservice/src/application/features/authentication/authentication.service';
@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class ControllerModule {}
