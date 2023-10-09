import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MeliaService } from './melia.service';

@Controller('melia')
export class MeliaController {
  constructor(private readonly meliaService: MeliaService) {}

  @Get()
  findAll() {
    return this.meliaService.findAll();
  }
  @Get('initiative/:initiative_id')
  findInitiative_id(@Param('initiative_id') initiative_id) {
    return this.meliaService.findByInitiativeID(initiative_id);
  }
  @Get(':id')
  findOne(@Param('id') id) {
    return this.meliaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.meliaService.update(id, body);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meliaService.remove(id);
  }

  @Post()
  create(@Body() body) {
    return this.meliaService.create(body);
  }
}
