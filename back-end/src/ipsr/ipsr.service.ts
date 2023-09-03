import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ipsr } from 'src/entities/ipsr.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IpsrService {
  constructor(
    @InjectRepository(Ipsr)
    private ipsrRepository: Repository<Ipsr>,
  ) {}

  findAll() {
    return this.ipsrRepository.find();
  }

  create(data: any) {
    return this.ipsrRepository.save(this.ipsrRepository.create({ ...data }));
  }
  findOne(id: number) {
    return this.ipsrRepository.findOneBy({ id });
  }

  update(id: number, data: any) {
    return this.ipsrRepository.update({ id }, { ...data });
  }
  remove(id: number) {
    return this.ipsrRepository.delete({ id });
  }
}
