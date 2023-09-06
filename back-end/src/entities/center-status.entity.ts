import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IpsrValue } from './ipsr-value.entity';
import { Initiative } from './initiative.entity';
import { Organization } from './organization.entity';

@Entity()
export class CenterStatus {

  @JoinColumn({ name: 'initiative_id' })
  @ManyToOne(() => Initiative, (initiative) => initiative.ipsrValues)
  initiative: Initiative;

  @Column({primary:true})
  initiative_id: number;

  @JoinColumn({ name: 'organization_id' })
  @ManyToOne(() => Organization)
  organization: Organization;

  @Column({primary:true})
  organization_id: number;

  @Column()
  status: boolean;

}
