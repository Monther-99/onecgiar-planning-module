import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { MeliaTypes } from 'src/entities/melia-types.entity';
import { Melia } from 'src/entities/melia.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MeliaService {
  constructor(
    @InjectRepository(Melia)
    private meliaRepository: Repository<Melia>,
    @InjectRepository(MeliaTypes)
    private meliaTypesRepository: Repository<MeliaTypes>,
    private readonly httpService: HttpService,
  ) {}

  findAll() {
    return this.meliaRepository.find();
  }

  findByInitiativeID(id) {
    return this.meliaRepository.find({ where: { initiative: { id: id } }, relations: ['meliaType'] });
  }

  create(data: any) {
    return this.meliaRepository.save(this.meliaRepository.create({ ...data }));
  }

  findOne(id: string) {
    return this.meliaRepository.findOne({
      where: { id },
      relations: [
        'partners',
        'other_initiatives',
        'initiative_countries',
        'co_initiative_countries',
      ],
    });
  }

  update(id: string, data: any) {
    return this.meliaRepository.save({ id, ...data });
  }
  remove(id: string) {
    return this.meliaRepository.delete({ id });
  }

  async importMeliaTypes() {
    const typesData = await firstValueFrom(
      this.httpService
        .get('https://api.clarisa.cgiar.org/api/study-types')
        .pipe(
          map((d: any) => d.data),
          catchError((error: AxiosError) => {
            throw new InternalServerErrorException();
          }),
        ),
    );

    typesData.forEach(async (type) => {
      const entity = await this.meliaTypesRepository.findOneBy({
        id: type.id,
      });
      if (entity != null) {
        this.meliaTypesRepository.update(entity.id, { ...type });
      } else {
        const newType = this.meliaTypesRepository.create({
          ...type,
        });
        this.meliaTypesRepository.save(newType);
      }
    });
  }

  getMeliaTypes() {
    return this.meliaTypesRepository.find();
  }
}
