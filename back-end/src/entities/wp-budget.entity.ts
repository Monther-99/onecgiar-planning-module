import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkPackage } from './workPackage.entity';
import { Organization } from './organization.entity';
import { Submission } from './submission.entity';
import { Initiative } from './initiative.entity';

@Entity()
export class WpBudget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  budget: string;

  @ManyToOne(() => WorkPackage)
  @JoinColumn({ name: 'wp_id' })
  workPackage: WorkPackage;

  @Column()
  wp_id: number;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_code' })
  organization: Organization;

  @Column()
  organization_code: string;

  @ManyToOne(() => Submission)
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;

  @Column({ nullable: true })
  submission_id: number;

  @ManyToOne(() => Initiative)
  @JoinColumn({ name: 'initiative_id' })
  initiative: Initiative;

  @Column({ nullable: true })
  initiative_id: number;
}
