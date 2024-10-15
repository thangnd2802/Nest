import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderGateway } from './order/order.gateway';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [OrderService, OrderGateway],
})
export class OrderModule {}
