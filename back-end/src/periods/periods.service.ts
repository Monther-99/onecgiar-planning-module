import { Injectable } from '@nestjs/common';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Period } from 'src/entities/period.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PeriodsService {
  constructor(
    @InjectRepository(Period) private periodRepository: Repository<Period>,
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

  remove(id: number) {
    return this.periodRepository.delete({ id });
  }
}
