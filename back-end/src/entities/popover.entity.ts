import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Popover {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('longtext')
  description: string;
}
