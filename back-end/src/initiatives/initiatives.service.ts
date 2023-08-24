import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateInitiativeDto } from './dto/create-initiative.dto';
import { UpdateInitiativeDto } from './dto/update-initiative.dto';
import { HttpService } from '@nestjs/axios';
import { Initiative } from 'src/entities/initiative.entity';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WorkPackage } from 'src/entities/workPackage.entity';
import { CreateWorkPackageDto } from './dto/create-workpackage.dto';
import { UpdateWorkPackageDto } from './dto/update-workpackage.dto';

@Injectable()
export class InitiativesService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Initiative)
    private initiativeRepository: Repository<Initiative>,
    @InjectRepository(WorkPackage)
    private workPackageRepository: Repository<WorkPackage>,
  ) {}

  @Cron(CronExpression.EVERY_WEEK)
  async importInitiatives() {
    const initiativesData = await firstValueFrom(
      this.httpService
        .get('https://api.clarisa.cgiar.org/api/allInitiatives')
        .pipe(
          map((d: any) => d.data),
          catchError((error: AxiosError) => {
            throw new InternalServerErrorException();
          }),
        ),
    );

    initiativesData.forEach(async (element) => {
      const { id, stages, ...parameters } = element;
      const entity = await this.initiativeRepository.findOneBy({ id });
      if (entity != null) {
        this.update(id, { ...parameters });
      } else {
        this.create({ id, ...parameters });
      }
    });
  }

  async importWorkPackages() {
    const workPackagesData = await firstValueFrom(
      this.httpService
        .get('https://api.clarisa.cgiar.org/api/workpackages')
        .pipe(
          map((d: any) => d.data),
          catchError((error: AxiosError) => {
            throw new InternalServerErrorException();
          }),
        ),
    );

    workPackagesData.forEach(async (element) => {
      const entity = await this.workPackageRepository.findOneBy({
        wp_id: element.wp_id,
      });
      if (entity != null) {
        this.updateWorkPackage(element.wp_id, { ...element });
      } else {
        this.createWorkPackage({ ...element });
      }
    });
  }

  create(createInitiativeDto: CreateInitiativeDto) {
    const newInitiative = this.initiativeRepository.create({
      ...createInitiativeDto,
    });
    this.initiativeRepository.save(newInitiative);
  }

  update(id: number, updateInitiativeDto: UpdateInitiativeDto) {
    this.initiativeRepository.update(id, { ...updateInitiativeDto });
  }

  createWorkPackage(createWorkPackageDto: CreateWorkPackageDto) {
    const newWorkPackage = this.workPackageRepository.create({
      ...createWorkPackageDto,
    });
    this.workPackageRepository.save(newWorkPackage);
  }

  updateWorkPackage(wp_id: number, updateWorkPackageDto: UpdateWorkPackageDto) {
    this.workPackageRepository.update(wp_id, { ...updateWorkPackageDto });
  }

  findAll() {
    return this.initiativeRepository.find();
  }

  findOne(id: number) {
    return this.initiativeRepository.findOne({ where:{id},relations:['organizations'] });
  }
}
