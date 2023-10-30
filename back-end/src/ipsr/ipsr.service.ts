import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ipsr } from 'src/entities/ipsr.entity';
import { Repository } from 'typeorm';
import { IpsrValue } from 'src/entities/ipsr-value.entity';
@Injectable()
export class IpsrService {
  constructor(
    @InjectRepository(Ipsr)
    private ipsrRepository: Repository<Ipsr>,
    @InjectRepository(IpsrValue)
    private ipsrValueRepository: Repository<IpsrValue>,
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
  async remove(id: number) {
    const ipsr = await this.ipsrValueRepository.find({
      where: {
        ipsr: {
          id: id
        }
      }
    });
    if(ipsr.length == 0) {
      return this.ipsrRepository.delete({ id });
    } else {
      throw new BadRequestException('The IPRS can not be deleted')
    }
  }
}
