import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Result } from './result.entity';
import { Initiative } from './initiative.entity';

@Entity()
export class Melia {
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

  @Column()
  wp_id:string
}
