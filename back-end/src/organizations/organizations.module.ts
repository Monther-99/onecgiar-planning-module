import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/entities/organization.entity';
import { Country } from 'src/entities/country.entity';
import { HttpModule } from '@nestjs/axios';
import { Partner } from 'src/entities/partner.entity';
import { Region } from 'src/entities/region.entity';
import { PhaseInitiativeOrganization } from 'src/entities/phase-initiative-organization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      Country,
      Partner,
      Region,
      PhaseInitiativeOrganization,
    ]),
    HttpModule,
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}
