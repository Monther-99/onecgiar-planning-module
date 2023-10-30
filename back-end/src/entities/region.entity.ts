import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from './country.entity';

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  um49Code: number;

  @ManyToOne(() => Region, (region) => region.childRegions)
  parentRegion: Region;

  @OneToMany(() => Region, (region) => region.parentRegion)
  childRegions: Region[];

  @OneToMany(() => Country, (country) => country.region)
  countries: Country[];
}
