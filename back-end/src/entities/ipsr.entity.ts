import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IpsrValue } from './ipsr-value.entity';

@Entity()
export class Ipsr {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany(() => IpsrValue, (ipsrValue) => ipsrValue.ipsr)
  ipsrValues: IpsrValue[];
}
