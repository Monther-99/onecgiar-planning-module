import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PopoverService } from './popover.service';
import { CreatePopoverDto } from './dto/create-popover.dto';
import { UpdatePopoverDto } from './dto/update-popover.dto';

@Controller('popover')
export class PopoverController {
  constructor(private readonly popoverService: PopoverService) {
  }

  @Post()
  create(@Body() createPopoverDto: CreatePopoverDto) {
    return this.popoverService.create(createPopoverDto);
  }

  @Get()
  findAll() {
    return this.popoverService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.popoverService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePopoverDto: UpdatePopoverDto) {
    return this.popoverService.update(+id, updatePopoverDto);
  }

}
