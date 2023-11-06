import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Initiative } from './initiative.entity';
import { Organization } from './organization.entity';
import { Phase } from './phase.entity';

@Entity()
export class PhaseInitiativeOrganization {
  @JoinColumn({ name: 'phase_id' })
  @ManyToOne(() => Phase)
  phase: Phase;

  @Column({ primary: true })
  phase_id: number;

  @JoinColumn({ name: 'initiative_id' })
  @ManyToOne(() => Initiative)
  initiative: Initiative;

  @Column({ primary: true })
  initiative_id: number;

  @JoinColumn({ name: 'organization_code' })
  @ManyToOne(() => Organization)
  organization: Organization;

  @Column({ primary: true })
  organization_code: string;
}
