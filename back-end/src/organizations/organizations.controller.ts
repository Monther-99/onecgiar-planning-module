import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

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

  @Get('import/regions')
  async importRegions() {
    await this.organizationsService.importRegions();
    return 'Regions imported successfully';
  }

  @Get('import/countries')
  async importCountries() {
    await this.organizationsService.importCountries();
    return 'Countries imported successfully';
  }

  @Get('import/partners')
  async importPartners() {
    await this.organizationsService.importPartners();
    return 'Partners imported successfully';
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(+id, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(+id);
  }
}
