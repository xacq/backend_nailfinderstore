// user/user-profile.entity.ts
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { TimestampedEntity } from '../base/timestamped.entity';
import { User } from './user.entity';

export enum Gender {
  FEMALE = 'female',
  MALE = 'male',
  NON_BINARY = 'non_binary',
  PREFER_NOT = 'prefer_not_to_say',
}

@Entity('user_profiles')
export class UserProfile extends TimestampedEntity {
  @OneToOne(() => User, (u) => u.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'user_id', type: 'char', length: 36 })
  userId!: string;

  @Column({ name: 'first_name', length: 100 })
  @IsString()
  @Length(1, 100)
  firstName!: string;

  @Column({ name: 'last_name', length: 100 })
  @IsString()
  @Length(1, 100)
  lastName!: string;

  @Column({ type: 'date', nullable: true })
  @IsOptional()
  @IsDateString()
  birthdate?: string | null;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender | null;

  @Column({ name: 'avatar_url', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  avatarUrl?: string | null;

  @Column({ name: 'loyalty_opt_in', type: 'tinyint', default: () => '1' })
  loyaltyOptIn!: boolean;

  @Column({ name: 'marketing_opt_in', type: 'tinyint', default: () => '1' })
  marketingOptIn!: boolean;
}
