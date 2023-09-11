import { Module } from '@nestjs/common';
import { PhasesService } from './phases.service';
import { PhasesController } from './phases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phase } from 'src/entities/phase.entity';
import { PhaseInitiativeOrganization } from 'src/entities/phase-initiative-organization.entity';
import { Initiative } from 'src/entities/initiative.entity';
import { Organization } from 'src/entities/organization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Phase,
      Initiative,
      Organization,
      PhaseInitiativeOrganization,
    ]),
  ],
  controllers: [PhasesController],
  providers: [PhasesService],
})
export class PhasesModule {}
