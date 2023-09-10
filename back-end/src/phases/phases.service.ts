import { Injectable } from '@nestjs/common';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Phase } from 'src/entities/phase.entity';
import { Repository } from 'typeorm';
import { PhaseInitiativeOrganization } from 'src/entities/phase-initiative-organization.entity';
import { Initiative } from 'src/entities/initiative.entity';
import { Organization } from 'src/entities/organization.entity';

@Injectable()
export class PhasesService {
  constructor(
    @InjectRepository(Phase) private phaseRepository: Repository<Phase>,
    @InjectRepository(PhaseInitiativeOrganization)
    private phaseInitOrgRepo: Repository<PhaseInitiativeOrganization>,
    @InjectRepository(Initiative)
    private initiativeRepository: Repository<Initiative>,
  ) {}

  create(createPhaseDto: CreatePhaseDto) {
    const newPhase = this.phaseRepository.create({ ...createPhaseDto });
    return this.phaseRepository.save(newPhase);
  }

  findAll() {
    return this.phaseRepository.find({ relations: ['previousPhase'] });
  }

  findOne(id: number) {
    return this.phaseRepository.findOne({
      where: { id },
      relations: ['previousPhase'],
    });
  }

  findActivePhase() {
    return this.phaseRepository.findOne({
      where: { active: true },
      relations: ['previousPhase'],
    });
  }

  update(id: number, updatePhaseDto: UpdatePhaseDto) {
    return this.phaseRepository.update({ id }, { ...updatePhaseDto });
  }

  remove(id: number) {
    return this.phaseRepository.delete({ id });
  }

  activate(id: number) {
    this.phaseRepository.update({}, { active: false });
    return this.phaseRepository.update({ id }, { active: true });
  }

  deactivate(id: number) {
    return this.phaseRepository.update({ id }, { active: false });
  }

  async assignOrganizations(data: any) {
    const { phase_id, initiative_id, ...organizations } = data;

    await this.phaseInitOrgRepo.delete({
      phase_id,
      initiative_id,
    });
    data.organizations.forEach(async (organization_id) => {
      const newPhaseInitOrg = await this.phaseInitOrgRepo.create({
        phase_id,
        initiative_id,
        organization_id,
      });
      await this.phaseInitOrgRepo.save(newPhaseInitOrg);
    });

    return true;
  }

  async fetchAssignedOrganizations(phase_id: number, initiative_id: number) {
    const data = await this.phaseInitOrgRepo.findBy({
      phase_id,
      initiative_id,
    });

    let organizations = [];
    data.forEach((element) => {
      organizations.push(element.organization_id);
    });

    return organizations;
  }

  async fetchPhaseInitiativesData(phase_id: number) {
    return this.initiativeRepository
      .createQueryBuilder('initiative')
      .leftJoin(
        PhaseInitiativeOrganization,
        'assigned_orgs',
        'assigned_orgs.initiative_id = initiative.id AND phase_id = ' +
          phase_id,
      )
      .leftJoin(
        Organization,
        'organizations',
        'organizations.id = assigned_orgs.organization_id',
      )
      .addSelect(
        'GROUP_CONCAT(organizations.name SEPARATOR ", ") AS assigned_organizations',
      )
      .groupBy('initiative.id')
      .getRawMany();
  }
}
