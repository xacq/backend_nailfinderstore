// rbac/business-user.entity.ts
import { Column, Entity, Index, ManyToOne, Unique } from 'typeorm';
import { TimestampedEntity } from '../base/timestamped.entity';
import { Business } from '../business/business.entity';
import { User } from '../user/user.entity';
import { Role } from './role.entity';

export enum BusinessUserStatus { INVITED='invited', ACTIVE='active', INACTIVE='inactive' }

@Entity('business_users')
@Unique('ux_business_users', ['businessId', 'userId'])
export class BusinessUser extends TimestampedEntity {
  @ManyToOne(() => Business, b => b.businessUsers, { onDelete: 'CASCADE' })
  @Index('fk_business_users_business')
  business!: Business;
  @Column({ name: 'business_id' }) businessId!: string;

  @ManyToOne(() => User, u => u.businessMemberships, { onDelete: 'CASCADE' })
  @Index('fk_business_users_user')
  user!: User;
  @Column({ name: 'user_id' }) userId!: string;

  @ManyToOne(() => Role, { nullable: true, onDelete: 'SET NULL' })
  @Index('fk_business_users_role')
  role?: Role | null;
  @Column({ name: 'role_id', nullable: true }) roleId?: string | null;

  @Column({ name: 'invitation_email', length: 150, nullable: true })
  invitationEmail?: string | null;

  @Column({ name: 'invited_at', type: 'timestamp', nullable: true })
  invitedAt?: Date | null;

  @Column({ name: 'accepted_at', type: 'timestamp', nullable: true })
  acceptedAt?: Date | null;

  @Column({ type: 'enum', enum: BusinessUserStatus, default: BusinessUserStatus.ACTIVE })
  status!: BusinessUserStatus;
}
