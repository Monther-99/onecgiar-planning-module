import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Period } from 'src/entities/period.entity';
import { Repository } from 'typeorm';
import { Phase } from 'src/entities/phase.entity';
import { ResultPeriodValues } from 'src/entities/resultPeriodValues.entity';
@Injectable()
export class PeriodsService {
  constructor(
    @InjectRepository(Period) private periodRepository: Repository<Period>,
    @InjectRepository(ResultPeriodValues) private resultPeriodValuesRepo: Repository<ResultPeriodValues>,

  ) {}

  create(createPeriodDto: any) {
    const newPeriod = this.periodRepository.create({ ...createPeriodDto });
    return this.periodRepository.save(newPeriod);
  }

  async findAll(query: any) {
    const take = query.limit || 10;
    const skip = (Number(query.page || 1) - 1) * take;
    const [finalResult,total] = await this.periodRepository.findAndCount({
      where: {
        phase: {
          id: query.phase
        }
      },
      take: take,
      skip: skip,
      relations: ['phase']
    });
    return {
      result: finalResult,
      count: total,
    };
  }

  findOne(id: number) {
    return this.periodRepository.findOne({
      where: { id },
      relations: ['phase'],
    });
  }
  findByPhaseId(phase_id){
    return this.periodRepository.find({
      where: { phase:{id:phase_id} },
    });
  }

  update(id: number, updatePeriodDto: any) {
    return this.periodRepository.update({ id }, { ...updatePeriodDto });
  }

  async remove(id: number) {
    let periods: any[] = await this.resultPeriodValuesRepo.find({
      where: {
        period: {
          id: id
        }
      },
      relations: [
        'period',
        'period.phase'
      ]
    });
    let phase = periods.map(d => {return d.period.phase})
    let isActive = false;
    phase.forEach(d => {
      if(d.active === true) {
        isActive = true
      }
      return isActive
    });

    if(periods.length != 0) {
      if(isActive) 
        throw new BadRequestException('The period can not be deleted as it’s related to an active phase.');
      throw new BadRequestException('The period can not be deleted as it’s related to submited phase.');
    } else {
      return this.periodRepository.delete({ id });
    }
  }
}
