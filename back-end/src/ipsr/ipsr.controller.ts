import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { IpsrService } from './ipsr.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/roles.guard';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/role.enum';

@UseGuards(JwtAuthGuard)
@Controller('ipsr')
export class IpsrController {
  constructor(private readonly ipsrService: IpsrService) {}

  @Get()
  findAll(@Query() query) {
    return this.ipsrService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return this.ipsrService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.ipsrService.update(+id, body);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ipsrService.remove(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() body) {
    return this.ipsrService.create(body);
  }
}
