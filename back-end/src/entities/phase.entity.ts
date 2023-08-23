import { Period } from 'src/entities/period.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Submission } from './submission.entity';

export enum phaseStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

@Entity()
export class Phase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  reportingYear: string;

  @Column({ type: 'uuid' })
  tocPhase: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'enum', enum: phaseStatus })
  status: phaseStatus;

  @ManyToOne(() => Phase, (phase) => phase.childPhases)
  previousPhase: Phase;

  @OneToMany(() => Phase, (phase) => phase.previousPhase)
  childPhases: Phase[];

  @OneToMany(() => Period, (period) => period.phase)
  periods: Period[];

  @OneToMany(() => Submission, (submission) => submission.phase)
  submissions: Submission[];
}
