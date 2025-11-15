import { PartialType } from '@nestjs/swagger';
import { CreateMenuItemDto } from './create-menu-item.dto.ts';

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {}
