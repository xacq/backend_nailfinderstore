// rbac/business-user.entity.ts
import { Column, Entity, Index, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { TimestampedEntity } from '../base/timestamped.entity';
import { Business } from '../business/business.entity';
import { User } from '../user/user.entity';
import { Role } from './role.entity';

export enum BusinessUserStatus {
  INVITED = 'invited',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('business_users')
@Index('fk_business_users_business', ['businessId'])
@Index('fk_business_users_user', ['userId'])
@Index('fk_business_users_role', ['roleId'])
@Unique('ux_business_users', ['businessId', 'userId'])
export class BusinessUser extends TimestampedEntity {
  @ManyToOne(() => Business, (b) => b.businessUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business!: Business;
  @Column({ name: 'business_id', type: 'char', length: 36 })
  businessId!: string;

  @ManyToOne(() => User, (u) => u.businessMemberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
  @Column({ name: 'user_id', type: 'char', length: 36 }) userId!: string;

  @ManyToOne(() => Role, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role_id' })
  role?: Role | null;
  @Column({ name: 'role_id', type: 'char', length: 36, nullable: true })
  roleId?: string | null;

  @Column({ name: 'invitation_email', length: 150, nullable: true })
  invitationEmail?: string | null;

  @Column({ name: 'invited_at', type: 'datetime', nullable: true })
  invitedAt?: Date | null;

  @Column({ name: 'accepted_at', type: 'datetime', nullable: true })
  acceptedAt?: Date | null;

  @Column({
    type: 'enum',
    enum: BusinessUserStatus,
    default: BusinessUserStatus.ACTIVE,
  })
  status!: BusinessUserStatus;
}
