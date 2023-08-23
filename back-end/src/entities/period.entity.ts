import { Phase } from 'src/entities/phase.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ResultPeriodValues } from './resultPeriodValues.entity';

@Entity()
export class Period {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: string;

  @Column()
  quarter: string;

  @ManyToOne(() => Phase, (phase) => phase.periods)
  phase: Phase;

  @OneToMany(
    () => ResultPeriodValues,
    (resultPeriodValues) => resultPeriodValues.period,
  )
  values: ResultPeriodValues[];
}
