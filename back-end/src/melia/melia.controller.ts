import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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

  @Get('submission/:submission_id')
  getSubmissionMelia(@Param('submission_id') submission_id: string) {
    return this.meliaService.findBySubmissionId(+submission_id);
  }

  @Get('initiative-melias/:initiative_id')
  getInitiativeMelias(@Param('initiative_id') initiative_id, @Query() query) {
    return this.meliaService.getInitiativeMelias(initiative_id, query);
  }

  @Get('initiative-melia/:id')
  getInitiativeMeliaById(@Param('id') id) {
    return this.meliaService.getInitiativeMeliaById(id);
  }

  @Get('initiative-melia/:initiative_id/:type_id')
  getInitiativeMelia(
    @Param('initiative_id') initiative_id,
    @Param('type_id') melia_type_id,
  ) {
    return this.meliaService.getInitiativeMelia(initiative_id, melia_type_id);
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return this.meliaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.meliaService.update(id, body);
  }

  @Patch('initiative-melia/:id')
  updateInitiativeMelia(@Param('id') id: string, @Body() body) {
    return this.meliaService.updateInitiativeMelia(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meliaService.remove(id);
  }

  @Delete('initiative-melia/:id')
  removeInitiativeMelia(@Param('id') id: string) {
    return this.meliaService.removeInitiativeMelia(+id);
  }

  @Post()
  create(@Body() body) {
    return this.meliaService.create(body);
  }

  @Post('initiative-melia')
  createInitiativeMelia(@Body() body) {
    return this.meliaService.createInitiativeMelia(body);
  }
}
