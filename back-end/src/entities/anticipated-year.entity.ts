import { Phase } from 'src/entities/phase.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AnticipatedYear {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  month: string;

  @Column()
  year: number;

  @ManyToOne(() => Phase, (phase) => phase.periods)
  phase: Phase;

}
