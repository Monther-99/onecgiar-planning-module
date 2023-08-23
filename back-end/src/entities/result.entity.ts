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

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  result_uuid: string;

  @Column()
  value: number;

  @ManyToOne(() => Organization, (organization) => organization.results)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => WorkPackage, (workPackage) => workPackage.wp_results)
  @JoinColumn({ name: 'wp_id' })
  workPackage: WorkPackage;

  @OneToMany(
    () => ResultPeriodValues,
    (resultPeriodValues) => resultPeriodValues.result,
  )
  values: ResultPeriodValues[];

  @ManyToOne(() => Submission, (submission) => submission.results)
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;
}
