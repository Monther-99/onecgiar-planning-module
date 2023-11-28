import { Injectable } from '@nestjs/common';
import { CreatePopoverDto } from './dto/create-popover.dto';
import { UpdatePopoverDto } from './dto/update-popover.dto';
import { Popover } from 'src/entities/popover.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PopoverService {
  constructor(
    @InjectRepository(Popover)
    private popoverRepository: Repository<Popover>,
  ) {
  }

  create(createPopoverDto: CreatePopoverDto) {
    const record = this.popoverRepository.create({
      ...createPopoverDto,
    } as unknown as Popover);
    return this.popoverRepository.save(record);
  }

  findAll() {
    return this.popoverRepository.find();
  }

  findOne(id: number) {
    return this.popoverRepository.findOneById(id);
  }

  update(id: number, updatePopoverDto: UpdatePopoverDto) {
    return this.popoverRepository.update(id, updatePopoverDto);
  }

  remove(id: number) {
    return `This action removes a #${id} popover`;
  }
}
