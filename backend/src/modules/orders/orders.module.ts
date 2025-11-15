import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController, OrdersAdminController } from './orders.controller';

@Module({
  controllers: [OrdersController, OrdersAdminController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
