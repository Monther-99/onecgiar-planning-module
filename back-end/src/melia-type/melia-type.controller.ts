import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeliaTypes } from 'src/entities/melia-types.entity';
import { ILike, Repository } from 'typeorm';

@Controller('melia-type')
export class MeliaTypeController {
    constructor(
        @InjectRepository(MeliaTypes)
        private meliaTypesRepository: Repository<MeliaTypes>,
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
    remove(@Param('id') id: string) {
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
