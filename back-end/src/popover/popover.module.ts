import { Module } from '@nestjs/common';
import { PopoverService } from './popover.service';
import { PopoverController } from './popover.controller';
import { Popover } from 'src/entities/popover.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PopoverController],
  providers: [PopoverService],
  imports: [TypeOrmModule.forFeature([Popover])],
})
export class PopoverModule {}
