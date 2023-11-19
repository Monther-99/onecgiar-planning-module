import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnticipatedYear } from 'src/entities/anticipated-year.entity';
import { Brackets, Repository } from 'typeorm';

@Controller('anticipated-year')
export class AnticipatedYearController {
    constructor(
        @InjectRepository(AnticipatedYear)
        private AnticipatedYearRepository: Repository<AnticipatedYear>,
    ) {}

    @Get('')
    async getMeliaTypes(@Query() query) {
    const result = this.AnticipatedYearRepository.createQueryBuilder('AnticipatedYear');
    result.where(
      new Brackets((qb) => {
        qb.where('month LIKE :month', {
            month: `%${query?.search || ''}%`,
        })
        .orWhere('year LIKE :year', { year: `%${query?.search || ''}%` })

      }),
    );
    result.leftJoinAndSelect('AnticipatedYear.phase', 'phase')
    .orWhere('name LIKE :name', { name: `%${query?.search || ''}%` })
    const finalResult = await result.getMany();
    return finalResult
    }

    @Get(':id')
    findOne(@Param('id') id: any) {
        return this.AnticipatedYearRepository.findOne({
            where: { id: id },
            relations: ['phase']
        });
    }
    @Delete(':id')
    async remove(@Param('id') id: number) {
      const AnticipatedYear = await this.AnticipatedYearRepository.findOne({
        where: {
          id: id
        },
        relations: ['phase']
      });
      if(AnticipatedYear.phase.active)
        throw new BadRequestException('The Anticipated Year can not be deleted as it’s related to an active phase.');
      return this.AnticipatedYearRepository.delete(id);
    }

    @Post()
    async create(@Body() body: any) {
      return await this.AnticipatedYearRepository.save(this.AnticipatedYearRepository.create({ ...body }));
    }

    @Put(':id')
    async update(@Param('id') id: any, @Body() body) {
      return await this.AnticipatedYearRepository.update({ id }, { ...body });
    }
}
