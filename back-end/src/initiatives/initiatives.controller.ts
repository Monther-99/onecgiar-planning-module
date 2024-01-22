import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InitiativesService } from './initiatives.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { InitiativeRoles } from 'src/entities/initiative-roles.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { createRoleReq, createRoleResponse, getInitiatives, importInitiatives, importInitiativeswp, updateRoleReq, updateRoleResponse } from 'DTO/initiatives.dto';
import { Initiative } from 'src/entities/initiative.entity';

@UseGuards(JwtAuthGuard)
@ApiTags('Initiatives')
@Controller('initiatives')
export class InitiativesController {
  constructor(private readonly initiativesService: InitiativesService) {}

  @Get('import')
  @ApiCreatedResponse({
    description: '',
    type: [importInitiatives],
  })
  async import() {
    await this.initiativesService.importInitiatives();
    return 'Initiatives imported successfully';
  }

  @Get('import/wp')
  @ApiCreatedResponse({
    description: '',
    type: [importInitiativeswp],
  })
  async importWP() {
    await this.initiativesService.importWorkPackages();
    return 'wp imported successfully';
  }

  @Get()
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '',
    type: [getInitiatives],
  })
  async findAll() {
    return this.initiativesService.findAll();
  }

  @Get('full')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '',
    type: [Initiative],
  })
  async findAllFull(@Query() query: any, @Req() req) {
    return this.initiativesService.findAllFull(query, req);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '',
    type: Initiative,
  })
  findOne(@Param('id') id: string) {
    return this.initiativesService.findOne(+id);
  }

  @Get(':id/roles')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '',
    type: [InitiativeRoles],
  })
  getRoles(@Param('id') id: number): Promise<InitiativeRoles[]> {
    return this.initiativesService.iniRolesRepository.find({
      where: { initiative_id: id },
      relations: ['user','organizations'],
    });
  }

  @Post(':initiative_id/roles')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '',
    type: [createRoleResponse],
  })
  @ApiBody({ type: createRoleReq})
  setRoles(
    @Param('initiative_id') initiative_id: number,
    @Body() initiativeRoles: InitiativeRoles,
  ) {
    return this.initiativesService.setRole(initiative_id, initiativeRoles);
  }

  @Put(':initiative_id/roles/:initiative_roles_id')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '',
    type: [updateRoleResponse],
  })
  @ApiBody({ type: updateRoleReq})
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
  @ApiBearerAuth()
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
