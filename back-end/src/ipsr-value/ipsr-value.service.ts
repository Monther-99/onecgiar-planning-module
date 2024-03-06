import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IpsrValue } from 'src/entities/ipsr-value.entity';
import { IpsrService } from 'src/ipsr/ipsr.service';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class IpsrValueService {
  constructor(
    @InjectRepository(IpsrValue)
    private ipsrValueRepository: Repository<IpsrValue>,
    private ipsrService: IpsrService,
  ) {}

  findByInitiativeID(id) {
    return this.ipsrValueRepository.find({
      where: {
        initiative: { id: id },
        submission_id: IsNull(),
        value: Not(IsNull()),
      },
      relations: ['ipsr'],
    });
  }

  findBySubmissionId(id) {
    return this.ipsrValueRepository.find({
      where: { submission_id: id, value: Not(IsNull()) },
      relations: ['ipsr'],
    });
  }

  findAll() {
    return this.ipsrValueRepository.find();
  }

  create(data: any) {
    return this.ipsrValueRepository.save(
      this.ipsrValueRepository.create({ ...data }),
    );
  }
  findOne(id: string) {
    return this.ipsrValueRepository.findOneBy({ id });
  }

  update(id: string, data: any) {
    return this.ipsrValueRepository.update({ id }, { ...data });
  }
  remove(id: string) {
    return this.ipsrValueRepository.delete({ id });
  }

  async save(data: any) {
    console.log(data)
    const { initiative_id } = data;
    const ipsrs = await this.ipsrService.findAll();
    for (let ipsr of ipsrs) {
      let ipsr_value: IpsrValue;
      ipsr_value = await this.ipsrValueRepository.findOneBy({
        initiative_id,
        ipsr_id: ipsr.id,
        submission_id: IsNull(),
      });
      if (!ipsr_value) ipsr_value = this.ipsrValueRepository.create();

      ipsr_value.initiative_id = initiative_id;
      ipsr_value.ipsr_id = ipsr.id;
      ipsr_value.value = data['value-' + ipsr.id];
      ipsr_value.description = data['description-' + ipsr.id];
       this.ipsrValueRepository.save(ipsr_value);
    }
    return {message:'Data Saved'}
  }
}
