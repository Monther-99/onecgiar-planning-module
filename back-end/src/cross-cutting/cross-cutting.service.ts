
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrossCutting } from 'src/entities/cross-cutting.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class CrossCuttingService {
  constructor(
    @InjectRepository(CrossCutting)
    private CrossCuttingRepository: Repository<CrossCutting>,
  ) {}

  findAll() {
    return this.CrossCuttingRepository.find();
  }

  findByInitiativeID(id) {
    return this.CrossCuttingRepository.find({
      where: { initiative: { id: id }, submission_id: IsNull() },
    });
  }

  findBySubmissionID(id) {
    return this.CrossCuttingRepository.find({ where: { submission_id: id } });
  }

  create(data: any) {
    return this.CrossCuttingRepository.save(this.CrossCuttingRepository.create({ ...data }));
  }
  findOne(id: string) {
    return this.CrossCuttingRepository.findOneBy({ id });
  }

  update(id: string, data: any) {
    return this.CrossCuttingRepository.update({ id }, { ...data });
  }
  remove(id: string) {
    return this.CrossCuttingRepository.delete({ id });
  }
}
