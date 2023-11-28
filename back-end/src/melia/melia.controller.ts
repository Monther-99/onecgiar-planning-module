import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MeliaService } from './melia.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/roles.guard';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/role.enum';

@UseGuards(JwtAuthGuard)
@Controller('melia')
export class MeliaController {
  constructor(private readonly meliaService: MeliaService) {}

  @Get('from-ost/:id')
  findAllOst(@Param('id') id) {
    return this.meliaService.getOstMelias(id);
  }

  @Get()
  findAll() {
    return this.meliaService.findAll();
  }

  @Get('types')
  getMeliaTypes() {
    return this.meliaService.getMeliaTypes();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('import/types')
  async getImportMeliaTypes() {
    await this.meliaService.importMeliaTypes();
    return 'Melia study types imported successfully';
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
