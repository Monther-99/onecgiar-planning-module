import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Result } from './result.entity';
import { Period } from './period.entity';

@Entity()
export class ResultPeriodValues {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: boolean;

  @ManyToOne(() => Result, (result) => result.values)
  result: Result;

  @ManyToOne(() => Period, (period) => period.values)
  period: Period;
}
