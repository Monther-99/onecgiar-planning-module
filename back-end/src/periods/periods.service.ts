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

  create(createPeriodDto: CreatePeriodDto) {
    const newPeriod = this.periodRepository.create({ ...createPeriodDto });
    return this.periodRepository.save(newPeriod);
  }

  findAll() {
    return this.periodRepository.find();
  }

  findOne(id: number) {
    return this.periodRepository.findOneBy({ id });
  }
}
