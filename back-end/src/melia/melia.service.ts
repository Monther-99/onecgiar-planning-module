import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Melia } from 'src/entities/melia.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MeliaService {
  constructor(
    @InjectRepository(Melia)
    private meliaRepository: Repository<Melia>,
  ) {}

  findAll() {
    return this.meliaRepository.find();
  }

  findByInitiativeID(id) {
    return this.meliaRepository.find({ where: { initiative: { id: id } } });
  }

  create(data: any) {
    return this.meliaRepository.save(this.meliaRepository.create({ ...data }));
  }
  findOne(id: string) {
    return this.meliaRepository.findOneBy({ id });
  }

  update(id: string, data: any) {
    return this.meliaRepository.update({ id }, { ...data });
  }
  remove(id: string) {
    return this.meliaRepository.delete({ id });
  }
}
