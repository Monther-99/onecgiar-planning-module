import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Result } from './result.entity';
import { Initiative } from './initiative.entity';
import { Ipsr } from './ipsr.entity';

@Entity()
export class IpsrValue {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'initiative_id' })
  @ManyToOne(() => Initiative, (initiative) => initiative.ipsrValues)
  initiative: Initiative;

  @Column()
  ipsr_id: number;

  @JoinColumn({ name: 'ipsr_id' })
  @ManyToOne(() => Ipsr, (Ipsr) => Ipsr.ipsrValues)
  @JoinColumn()
  ipsr: Ipsr;

  @Column()
  initiative_id: number;

  @Column({ default: null })
  value: number;

}
