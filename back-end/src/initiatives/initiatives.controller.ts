import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { InitiativesService } from './initiatives.service';
import { ApiTags } from '@nestjs/swagger';
import { InitiativeRoles } from 'src/entities/initiative-roles.entity';

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
    return 'wp imported successfully';
  }



  @Get()
  async findAll() {
    return this.initiativesService.findAll();
  }

  @Get('full')
  async findAllFull() {
    return this.initiativesService.findAllFull();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.initiativesService.findOne(+id);
  }

  @Get(':id/roles')
  getRoles(@Param('id') id: number): Promise<InitiativeRoles[]> {
    return this.initiativesService.iniRolesRepository.find({
      where: { initiative_id: id },
      relations: ['user','organizations'],
    });
  }

  @Post(':initiative_id/roles')
  setRoles(
    @Param('initiative_id') initiative_id: number,
    @Body() initiativeRoles: InitiativeRoles,
  ) {
    return this.initiativesService.setRole(initiative_id, initiativeRoles);
  }

  @Put(':initiative_id/roles/:initiative_roles_id')
  updateMitigation(
    @Body() roles: InitiativeRoles,
    @Param('initiative_id') initiative_id: number,
    @Param('initiative_roles_id') initiative_roles_id: number,
  ) {
    return this.initiativesService.updateRoles(
      initiative_id,
      initiative_roles_id,
      roles,
    );
  }
  @Delete(':initiative_id/roles/:initiative_roles_id')
  deleteRoles(
    @Param('initiative_id') initiative_id: number,
    @Param('initiative_roles_id') initiative_roles_id: number,
  ) {
    return this.initiativesService.deleteRole(
      initiative_id,
      initiative_roles_id,
    );
  }
  
}
