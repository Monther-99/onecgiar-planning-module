import { Phase } from 'src/entities/phase.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ResultPeriodValues } from './resultPeriodValues.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Period {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  year: number;

  @ApiProperty()
  @Column()
  quarter: string;

  @ApiProperty()
  @ManyToOne(() => Phase, (phase) => phase.periods)
  phase: Phase;

  @ApiProperty()
  @OneToMany(
    () => ResultPeriodValues,
    (resultPeriodValues) => resultPeriodValues.period,
  )
  values: ResultPeriodValues[];
}
