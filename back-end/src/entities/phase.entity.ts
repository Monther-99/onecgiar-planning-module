import { Period } from 'src/entities/period.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Submission } from './submission.entity';
import { AnticipatedYear } from './anticipated-year.entity';

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
  reportingYear: number;

  @Column({ type: 'uuid' })
  tocPhase: string;

  @Column({ type: 'timestamp', default: null })
  startDate: Date;

  @Column({ type: 'timestamp', default: null })
  endDate: Date;

  @Column({ type: 'enum', enum: phaseStatus })
  status: phaseStatus;

  @ManyToOne(() => Phase, (phase) => phase.childPhases, {
    onDelete: 'SET NULL',
  })
  previousPhase: Phase;

  @OneToMany(() => Phase, (phase) => phase.previousPhase, {
    onDelete: 'SET NULL',
  })
  childPhases: Phase[];

  @OneToMany(() => Period, (period) => period.phase)
  periods: Period[];

  @OneToMany(() => AnticipatedYear, (AnticipatedYear) => AnticipatedYear.phase)
  AnticipatedYear: AnticipatedYear[];

  @OneToMany(() => Submission, (submission) => submission.phase)
  submissions: Submission[];

  @Column({ default: false })
  active: boolean;

  @Column({ default: false })
  show_eoi: boolean;

  @Column({ default: false })
  show_melia: boolean;
}
