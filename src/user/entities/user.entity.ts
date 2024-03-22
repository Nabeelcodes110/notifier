import {
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';
import { Site } from 'src/site/entities/site.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  username: string;

  @Column({ type: 'varchar', length: 30 })
  email: string;

  @Column({ type: 'varchar', length: 300 })
  password: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @OneToMany((type) => Site, (site) => site.owner)
  sites: Site[];
}
