import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { InitiativesService } from './initiatives.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Initiatives')
@Controller('initiatives')
export class InitiativesController {
  constructor(private readonly initiativesService: InitiativesService) {}

  @Get('import')
  async import() {
    await this.initiativesService.importInitiatives();
    return 'Initiatives imported successfully';
  }

  @Get('import/wp')
  async importWP() {
    await this.initiativesService.importWorkPackages();
    return 'Initiatives imported successfully';
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.initiativesService.findOne(+id);
  }
  @Get()
  async findAll() {
    return this.initiativesService.findAll();
  }


}
