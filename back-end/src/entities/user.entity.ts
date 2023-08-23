import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Submission } from './submission.entity';

export enum userRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: userRole })
  role: userRole;

  @OneToMany(() => Submission, (submission) => submission.user)
  submissions: Submission[];
}
