import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Submission } from './submission.entity';
import { ApiProperty } from '@nestjs/swagger';
import { InitiativeRoles } from './initiative-roles.entity';
import { IpsrValue } from './ipsr-value.entity';
import { CenterStatus } from './center-status.entity';
import { Melia } from './melia.entity';
import { InitiativeMelia } from './initiative-melia.entity';

@Entity()
export class Initiative {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  active: number;

  @Column()
  status: string;

  @Column()
  stageId: number;

  @Column()
  short_name: string;

  @Column()
  description: string;

  @Column()
  official_code: string;

  @Column()
  action_area_id: string;

  @Column()
  action_area_description: string;

  @ManyToMany(() => Organization, (organization) => organization.initiatives)
  @JoinTable()
  organizations: Organization[];

  @OneToMany(() => Submission, (submission) => submission.initiative)
  submissions: Submission[];

  @OneToMany(() => Submission, (melias) => melias.initiative)
  melias: Submission[];

  @ApiProperty({ type: () => [InitiativeRoles] })
  @OneToMany(
    () => InitiativeRoles,
    (initiative_roles) => initiative_roles.initiative,
    { onUpdate: 'RESTRICT', onDelete: 'RESTRICT' },
  )
  @JoinTable()
  roles: Array<InitiativeRoles>;

  @ApiProperty({ type: () => [CenterStatus] })
  @OneToMany(() => CenterStatus, (center_status) => center_status.initiative, {
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
  })
  @JoinTable()
  center_status: Array<CenterStatus>;

  @Column({ nullable: true })
  last_update_at: Date;
  @Column({ nullable: true })
  last_submitted_at: Date;

  @OneToMany(() => IpsrValue, (ipsrValue) => ipsrValue.initiative)
  ipsrValues: IpsrValue[];

  @Column({ nullable: true, default: null })
  latest_submission_id: number;

  @ManyToOne(() => Submission)
  @JoinColumn({ name: 'latest_submission_id' })
  latest_submission: Submission;

  // @ManyToMany(() => Melia, (melia) => melia.other_initiatives)
  // melia: Melia[];

  @ManyToMany(() => InitiativeMelia, (initiativeMelia) => initiativeMelia.other_initiatives)
  initiativeMelia: InitiativeMelia[];
}
