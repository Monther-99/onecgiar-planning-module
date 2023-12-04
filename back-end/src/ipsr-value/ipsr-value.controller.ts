import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IpsrValueService } from './ipsr-value.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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

  @Get('submission/:submission_id')
  getSubmissionIpsrValues(@Param('submission_id') submission_id: string) {
    return this.ipsrValueService.findBySubmissionId(+submission_id);
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
