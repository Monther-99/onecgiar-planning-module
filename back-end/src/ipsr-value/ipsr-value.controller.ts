import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { IpsrValueService } from './ipsr-value.service';

@Controller('ipsr-value')
export class IpsrValueController {
  constructor(private readonly ipsrValueService: IpsrValueService) {}

  @Get()
  findAll() {
    return this.ipsrValueService.findAll();
  }
  @Get('initiative/:initiative_id')
  findInitiative_id(@Param('initiative_id') initiative_id) {
    return this.ipsrValueService.findByInitiativeID(initiative_id);
  }
  @Get(':id')
  findOne(@Param('id') id) {
    return this.ipsrValueService.findOne(id);
  }

  @Post()
  create(@Body() body) {
    return this.ipsrValueService.save(body);
  }
}
