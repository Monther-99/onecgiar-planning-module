import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { InitiativeMelia } from 'src/entities/initiative-melia.entity';
import { MeliaTypes } from 'src/entities/melia-types.entity';
import { Melia } from 'src/entities/melia.entity';
import { Partner } from 'src/entities/partner.entity';
import { ILike, IsNull, Repository } from 'typeorm';

@Injectable()
export class MeliaService {
  constructor(
    @InjectRepository(Melia)
    private meliaRepository: Repository<Melia>,
    @InjectRepository(MeliaTypes)
    private meliaTypesRepository: Repository<MeliaTypes>,
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
    @InjectRepository(InitiativeMelia)
    private initiativeMeliaRepository: Repository<InitiativeMelia>,
    private readonly httpService: HttpService,
  ) {}
  api = process.env.Ost_API;

  findAll() {
    return this.meliaRepository.find();
  }

  findByInitiativeID(id) {
    return this.meliaRepository.find({
      where: { initiative: { id: id }, submission_id: IsNull() },
      relations: ['initiativeMelia.meliaType'],
    });
  }

  findBySubmissionId(id) {
    return this.meliaRepository.find({
      where: { submission_id: id },
      relations: ['initiativeMelia.meliaType'],
    });
  }

  async create(data: any) {
    let { partners } = data;
    let partnersArray = [];
    if(partners) {
      for (let partner of partners) {
        let partnerEntity = await this.partnerRepository.findOneBy({
          code: partner.code,
        });
        if (partnerEntity) partnersArray.push(partnerEntity);
      }
    }

    data.partners = partnersArray;
    return this.meliaRepository.save(this.meliaRepository.create({ ...data }));
  }

  findOne(id: string) {
    return this.meliaRepository.findOne({
      where: { id },
      relations: [
        'partners',
        'initiative_countries',
        'initiative_regions',
        'co_initiative_countries',
        'co_initiative_regions',
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
              auth: await this.loginOst(),
            },
          },
        )
        .pipe(map((d: any) => d.data.response.meliaStudiesActivities)),
    );
  }

  getInitiativeMelias(initiative_id: any, query: any) {
    return this.initiativeMeliaRepository.find({
      where: {
        initiative_id: initiative_id,
        submission_id: IsNull(),
        meliaType: { name: query?.type ? ILike(`%${query?.type}%`) : null },
      },
      relations: ['meliaType'],
    });
  }

  getInitiativeMeliaById(id: any) {
    return this.initiativeMeliaRepository.findOne({
      where: { id: id },
      relations: ['meliaType', 'other_initiatives'],
    });
  }

  getInitiativeMelia(initiative_id: any, melia_type_id: any) {
    return this.initiativeMeliaRepository.findOne({
      where: { initiative_id: initiative_id, melia_type_id: melia_type_id, submission_id: IsNull() },
      relations: ['meliaType', 'other_initiatives'],
    });
  }

  async createInitiativeMelia(data: any) {
    return this.initiativeMeliaRepository.save(
      this.initiativeMeliaRepository.create({ ...data }),
    );
  }

  updateInitiativeMelia(id: number, data: any) {
    return this.initiativeMeliaRepository.save({ id, ...data });
  }

  async removeInitiativeMelia(id: number) {
    const meliaUsed = await this.meliaRepository.find({
      where: {
        initiativeMelia: {
          id: id
        }
      }
    });
    
    if(meliaUsed.length)
      throw new BadRequestException('The MELIA type cannot be deleted as it’s used in initiative.');
    return this.initiativeMeliaRepository.delete({ id });
  }
}
