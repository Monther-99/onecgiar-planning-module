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
  api = process.env.Ost_API;

  findAll() {
    return this.meliaRepository.find();
  }

  findByInitiativeID(id) {
    return this.meliaRepository.find({
      where: { initiative: { id: id } },
      relations: ['meliaType'],
    });
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
        'initiative_regions',
        'co_initiative_countries',
        'co_initiative_regions'
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

  async loginOst() {
    return await firstValueFrom(
      this.httpService
        .post(this.api + 'auth/login', {
          email: 'tocadmin@cgiar.org',
          password: 'Toc.2021',
        })
        .pipe(map((d: any) => d.data.response.token)),
    );
  }
  async getOstMelias(initiative_id) {
    return await firstValueFrom(
      this.httpService
        .get(
          this.api +
            'stages-control/proposal/melia/studies-activities/4/' +
            initiative_id,
          {
            headers: {
              auth:await this.loginOst(),
            },
          },
        )
        .pipe(map((d: any) => d.data.response.meliaStudiesActivities)),
    );
  }
 
}
