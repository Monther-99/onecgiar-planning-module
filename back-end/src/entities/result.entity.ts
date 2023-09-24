import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ResultPeriodValues } from './resultPeriodValues.entity';
import { Organization } from './organization.entity';
import { WorkPackage } from './workPackage.entity';
import { Submission } from './submission.entity';
import { Initiative } from './initiative.entity';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  result_uuid: string;

  @Column({type:'float'})
  value: number;

  @Column()
  budget: string;

  @ManyToOne(() => Organization, (organization) => organization.results)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column()
  organization_id: number;

  @ManyToOne(() => WorkPackage, (workPackage) => workPackage.wp_results)
  @JoinColumn({ name: 'wp_id' })
  workPackage: WorkPackage;

  @Column()
  wp_id: number;
  @OneToMany(
    () => ResultPeriodValues,
    (resultPeriodValues) => resultPeriodValues.result,{onDelete:'CASCADE',onUpdate:'CASCADE'}
  )
  values: ResultPeriodValues[];

  @ManyToOne(() => Submission, (submission) => submission.results)
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;
  @Column()
  initiative_id: number;
  @ManyToOne(() => Initiative, (initiative) => initiative)
  @JoinColumn({ name: 'initiative_id' })
  initiative: Initiative;
}

