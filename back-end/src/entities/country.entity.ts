import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Melia } from './melia.entity';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: number;

  @Column()
  isoAlpha2: string;

  @Column()
  isoAlpha3: string;

  @ManyToMany(() => Melia, (melia) => melia.initiative_countries)
  melia: Melia[];

  @ManyToMany(() => Melia, (melia) => melia.co_initiative_countries)
  melia_co: Melia[];
}
