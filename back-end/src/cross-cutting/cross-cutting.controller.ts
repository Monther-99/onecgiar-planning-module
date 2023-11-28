
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CrossCuttingService } from './cross-cutting.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cross-cutting')
export class CrossCuttingController {
  constructor(private readonly CrossCuttingService: CrossCuttingService) {}

  @Get()
  findAll() {
    return this.CrossCuttingService.findAll();
  }
  @Get('initiative/:initiative_id')
  findInitiative_id(@Param('initiative_id') initiative_id) {
    return this.CrossCuttingService.findByInitiativeID(initiative_id);
  }
  @Get(':id')
  findOne(@Param('id') id) {
    return this.CrossCuttingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.CrossCuttingService.update(id, body);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.CrossCuttingService.remove(id);
  }

  @Post()
  create(@Body() body) {
    return this.CrossCuttingService.create(body);
  }
}
