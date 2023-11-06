import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Result } from './result.entity';
import { Initiative } from './initiative.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  code: string;

  @Column()
  name: string;

  @Column()
  acronym: string;

  @ManyToMany(() => Initiative, (initiative) => initiative.organizations)
  initiatives: Initiative[];

  @OneToMany(() => Result, (result) => result.organization)
  results: Result[];
}
