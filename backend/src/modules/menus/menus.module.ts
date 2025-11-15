import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController, MenusAdminController } from './menus.controller';

@Module({
  controllers: [MenusController, MenusAdminController],
  providers: [MenusService],
  exports: [MenusService],
})
export class MenusModule {}
