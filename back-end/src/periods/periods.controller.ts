import { Controller, Get, Param } from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Periods')
@Controller('periods')
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  @Get()
  findAll() {
    return this.periodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.periodsService.findOne(+id);
  }
}
