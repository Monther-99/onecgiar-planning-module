import { Module } from '@nestjs/common';
import { PhasesService } from './phases.service';
import { PhasesController } from './phases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phase } from 'src/entities/phase.entity';
import { PhaseInitiativeOrganization } from 'src/entities/phase-initiative-organization.entity';
import { Initiative } from 'src/entities/initiative.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Phase, Initiative, PhaseInitiativeOrganization])],
  controllers: [PhasesController],
  providers: [PhasesService],
})
export class PhasesModule {}
