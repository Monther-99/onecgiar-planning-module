import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { IpsrService } from './ipsr.service';

@Controller('ipsr')
export class IpsrController {
  constructor(private readonly ipsrService: IpsrService) {}

  @Get()
  findAll() {
    return this.ipsrService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return this.ipsrService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.ipsrService.update(+id, body);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ipsrService.remove(+id);
  }

  @Post()
  create(@Body() body) {
    return this.ipsrService.create(body);
  }
}
