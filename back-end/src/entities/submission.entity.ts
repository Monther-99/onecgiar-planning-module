import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Phase } from './phase.entity';
import { Initiative } from './initiative.entity';
import { Result } from './result.entity';

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json', nullable: true })
  toc_data: string;

  @ManyToOne(() => User, (user) => user.submissions)
  user: User;

  @ManyToOne(() => Phase, (phase) => phase.submissions)
  phase: Phase;

  @ManyToOne(() => Initiative, (initiative) => initiative.submissions)
  initiative: Initiative;

  @OneToMany(() => Result, (result) => result.submission)
  results: Result[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;
}
