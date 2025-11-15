import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController, TenantsAdminController } from './tenants.controller';

@Module({
  controllers: [TenantsController, TenantsAdminController],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}
