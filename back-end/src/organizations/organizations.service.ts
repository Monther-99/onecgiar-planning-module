import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/entities/organization.entity';
import { Repository } from 'typeorm';
import { catchError, firstValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { Country } from 'src/entities/country.entity';
import { Partner } from 'src/entities/partner.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
  ) {}

  create(createOrganizationDto: CreateOrganizationDto) {
    const newOrganization = this.organizationRepository.create({
      ...createOrganizationDto,
    });
    return this.organizationRepository.save(newOrganization);
  }

  findAll() {
    return this.organizationRepository.find();
  }

  findOne(id: number) {
    return this.organizationRepository.findOneBy({ id });
  }

  update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationRepository.update(
      { id },
      { ...updateOrganizationDto },
    );
  }

  remove(id: number) {
    return this.organizationRepository.delete({ id });
  }

  async importCountries() {
    const countriesData = await firstValueFrom(
      this.httpService.get('https://api.clarisa.cgiar.org/api/countries').pipe(
        map((d: any) => d.data),
        catchError((error: AxiosError) => {
          throw new InternalServerErrorException();
        }),
      ),
    );

    countriesData.forEach(async (country) => {
      let { regionDTO, ...data } = country;
      const entity = await this.countryRepository.findOneBy({
        code: country.code,
      });
      if (entity != null) {
        this.countryRepository.update(entity.id, { ...data });
      } else {
        const newCountry = this.countryRepository.create({
          ...data,
        });
        this.countryRepository.save(newCountry);
      }
    });
  }

  getCountries() {
    return this.countryRepository.find({ order: { name: 'ASC' } });
  }

  async importPartners() {
    const partnersData = await firstValueFrom(
      this.httpService
        .get('https://api.clarisa.cgiar.org/api/institutions')
        .pipe(
          map((d: any) => d.data),
          catchError((error: AxiosError) => {
            throw new InternalServerErrorException();
          }),
        ),
    );

    partnersData.forEach(async (partner) => {
      let { added, institutionType, countryOfficeDTO, ...data } = partner;
      const entity = await this.partnerRepository.findOneBy({
        code: partner.code,
      });
      if (entity != null) {
        this.partnerRepository.update(entity.id, { ...data });
      } else {
        const newPartner = this.partnerRepository.create({
          ...data,
        });
        this.partnerRepository.save(newPartner);
      }
    });
  }

  getPartners() {
    return this.partnerRepository.find({ order: { name: 'ASC' } });
  }

  searchPartners(term: string) {
    return this.partnerRepository
      .createQueryBuilder('partner')
      .where('partner.acronym like :acronym', { acronym: `%${term}%` })
      .orWhere('partner.name like :name', { name: `%${term}%` })
      .orderBy('partner.name')
      .getMany();
  }
}
