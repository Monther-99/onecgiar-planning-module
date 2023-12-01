import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { InitiativeMelia } from 'src/entities/initiative-melia.entity';
import { MeliaTypes } from 'src/entities/melia-types.entity';
import { Melia } from 'src/entities/melia.entity';
import { Role } from 'src/role/role.enum';
import { Roles } from 'src/role/roles.decorator';
import { RolesGuard } from 'src/role/roles.guard';
import { ILike, Repository } from 'typeorm';

@UseGuards(JwtAuthGuard)
@Controller('melia-type')
export class MeliaTypeController {
    constructor(
        @InjectRepository(MeliaTypes)
        private meliaTypesRepository: Repository<MeliaTypes>,
        @InjectRepository(InitiativeMelia)
        private initiativeMeliaRepository: Repository<InitiativeMelia>,
      ) {}

    @Get('')
    getMeliaTypes(@Query() query) {
    console.log(query)
    return this.meliaTypesRepository.find({
        where: {
            name:  query?.name ? ILike(`%${query?.name}%`) : null, 
        }
      });
    }

    @Get(':id')
    findOne(@Param('id') id: any) {
      return this.meliaTypesRepository.findOne({where: { id: id }});
    }

    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @Delete(':id')
    async remove(@Param('id') id: number) {
      const initiativeMelia = await this.initiativeMeliaRepository.find({
        where: {
          melia_type_id: id
        }
      });
      if(initiativeMelia.length)
        throw new BadRequestException('MELIA type can not be deleted, This MELIA type is assigned for an initiative(s)')
      return this.meliaTypesRepository.delete(id);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @Post()
    async create(@Body() body: any) {
      return await this.meliaTypesRepository.save(this.meliaTypesRepository.create({ ...body }));
    }

    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @Put(':id')
    async update(@Param('id') id: any, @Body() body) {
      return await this.meliaTypesRepository.update({ id }, { ...body });
    }
}
