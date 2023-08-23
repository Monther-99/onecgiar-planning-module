import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Submission } from './submission.entity';

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
}
