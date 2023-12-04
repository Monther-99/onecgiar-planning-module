import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Result } from './result.entity';
import { Initiative } from './initiative.entity';
import { Submission } from './submission.entity';

@Entity()
export class CrossCutting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @JoinColumn({ name: 'initiative_id' })
  @ManyToOne(() => Initiative, (initiative) => initiative.submissions)
  initiative: Initiative;
 
  @Column()
  initiative_id: number;

  @ManyToOne(() => Submission, (submission) => submission.crossCutting)
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;

  @Column({ nullable: true })
  submission_id: number;
}
