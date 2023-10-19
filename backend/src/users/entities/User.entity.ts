import { Entity, Column, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
  @Column({ primary: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;
}