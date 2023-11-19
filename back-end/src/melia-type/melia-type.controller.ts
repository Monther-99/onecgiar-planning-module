import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeliaTypes } from 'src/entities/melia-types.entity';
import { Melia } from 'src/entities/melia.entity';
import { ILike, Repository } from 'typeorm';

@Controller('melia-type')
export class MeliaTypeController {
    constructor(
        @InjectRepository(MeliaTypes)
        private meliaTypesRepository: Repository<MeliaTypes>,
        @InjectRepository(Melia)
        private MeliaRepository: Repository<Melia>,
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
    @Delete(':id')
    async remove(@Param('id') id: number) {
      const melia = await this.MeliaRepository.find({
        where: {
          melia_type: id
        }
      });
      if(melia.length)
        throw new BadRequestException('MELIA type can not be deleted, This MELIA type is assigned for an initiative(s)')
      return this.meliaTypesRepository.delete(id);
    }

    @Post()
    async create(@Body() body: any) {
      return await this.meliaTypesRepository.save(this.meliaTypesRepository.create({ ...body }));
    }

    @Put(':id')
    async update(@Param('id') id: any, @Body() body) {
      return await this.meliaTypesRepository.update({ id }, { ...body });
    }
}
