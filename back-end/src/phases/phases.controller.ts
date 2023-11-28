import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PhasesService } from './phases.service';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/role.enum';
import { RolesGuard } from 'src/role/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('Phases')
@Controller('phases')
export class PhasesController {
  constructor(private readonly phasesService: PhasesService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() createPhaseDto: CreatePhaseDto) {
    return this.phasesService.create(createPhaseDto);
  }

  @Post('assign-orgs')
  assignOrganizations(@Body() data: any) {
    return this.phasesService.assignOrganizations(data);
  }

  @Get()
  findAll(@Query() query) {
    return this.phasesService.findAll(query);
  }

  @Get('active')
  findActiveOne() {
    return this.phasesService.findActivePhase();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phasesService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('activate/:id')
  activate(@Param('id') id: string) {
    return this.phasesService.activate(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('deactivate/:id')
  deactivate(@Param('id') id: string) {
    return this.phasesService.deactivate(+id);
  }

  @Get(':id/initiatives')
  getInitiatives(@Param('id') id: string) {
    return this.phasesService.fetchPhaseInitiativesData(+id);
  }

  @Get('assigned-orgs/:phase_id/:initiative_id')
  getAssignedOrganizations(
    @Param('phase_id') phase_id: string,
    @Param('initiative_id') initiative_id: string,
  ) {
    return this.phasesService.fetchAssignedOrganizations(
      +phase_id,
      +initiative_id,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhaseDto: UpdatePhaseDto) {
    return this.phasesService.update(+id, updatePhaseDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phasesService.remove(+id);
  }
}
