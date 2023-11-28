import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/roles.guard';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/role.enum';

@UseGuards(JwtAuthGuard)
@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Post('countries-regions')
  getCountriesRegions(@Body() codes: any) {
    return this.organizationsService.getCountriesRegions(codes);
  }

  @Get()
  findAll(@Query() query) {
    return this.organizationsService.findAll(query);
  }

  @Get('regions')
  async getRegions() {
    return this.organizationsService.getRegions();
  }

  @Get('countries')
  async getCountries() {
    return this.organizationsService.getCountries();
  }

  @Get('partners')
  async getPartners() {
    return this.organizationsService.getPartners();
  }

  @Get('partners/:term')
  async searchPartners(@Param('term') term: string) {
    return this.organizationsService.searchPartners(term);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('import/regions')
  async importRegions() {
    await this.organizationsService.importRegions();
    return 'Regions imported successfully';
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('import/countries')
  async importCountries() {
    await this.organizationsService.importCountries();
    return 'Countries imported successfully';
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('import/partners')
  async importPartners() {
    await this.organizationsService.importPartners();
    return 'Partners imported successfully';
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(+id, updateOrganizationDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(+id);
  }
}
