// user/user.entity.ts
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { SoftDeletableEntity } from '../base/soft-deletable.entity';
import { Business } from '../business/business.entity';
import { UserProfile } from './user-profile.entity';
import { UserAddress } from './user-address.entity';
import { BusinessUser } from '../rbac/business-user.entity';
import { UserRole } from '../rbac/user-role.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INVITED = 'invited',
  SUSPENDED = 'suspended',
}

@Entity('users')
@Index('ux_users_email', ['email'], { unique: true })
@Index('fk_users_business', ['defaultBusinessId'])
export class User extends SoftDeletableEntity {
  @ManyToOne(() => Business, (b) => b.defaultBusinessUsers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'business_id' })
  defaultBusiness?: Business | null;

  @Column({ name: 'business_id', type: 'char', length: 36, nullable: true })
  defaultBusinessId?: string | null;

  @Column({ length: 150 })
  @IsEmail()
  @Length(3, 150)
  email!: string;

  @Column({ length: 30, nullable: true })
  @IsOptional()
  @IsString()
  phone?: string | null;

  @Column({ name: 'password_hash', length: 255 })
  @IsString()
  @Length(60, 255)
  passwordHash!: string;

  @Column({ name: 'auth_provider', length: 50, default: 'password' })
  @IsString()
  @Length(2, 50)
  authProvider!: string;

  @Column({ name: 'is_email_verified', type: 'tinyint', default: () => '0' })
  isEmailVerified!: boolean;

  @Column({ name: 'is_phone_verified', type: 'tinyint', default: () => '0' })
  isPhoneVerified!: boolean;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  @IsEnum(UserStatus)
  status!: UserStatus;

  @Column({ name: 'last_login_at', type: 'datetime', nullable: true })
  lastLoginAt?: Date | null;

  // Relaciones
  @OneToOne(() => UserProfile, (up) => up.user, { cascade: true })
  profile?: UserProfile;

  @OneToMany(() => UserAddress, (ua) => ua.user, { cascade: false })
  addresses!: UserAddress[];

  @OneToMany(() => BusinessUser, (bu) => bu.user)
  businessMemberships!: BusinessUser[];

  @OneToMany(() => UserRole, (ur) => ur.user)
  roleAssignments!: UserRole[];
}
