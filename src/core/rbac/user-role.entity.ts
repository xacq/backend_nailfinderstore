// rbac/user-role.entity.ts
import { Column, Entity, Index, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { TimestampedEntity } from '../base/timestamped.entity';
import { User } from '../user/user.entity';
import { Role } from './role.entity';
import { Business } from '../business/business.entity';

@Entity('user_roles')
@Index('fk_user_roles_user', ['userId'])
@Index('fk_user_roles_role', ['roleId'])
@Index('fk_user_roles_business', ['businessId'])
@Unique('ux_user_roles_assignment', ['userId', 'roleId', 'businessId'])
export class UserRole extends TimestampedEntity {
  @ManyToOne(() => User, (u) => u.roleAssignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
  @Column({ name: 'user_id', type: 'char', length: 36 }) userId!: string;

  @ManyToOne(() => Role, (r) => r.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role!: Role;
  @Column({ name: 'role_id', type: 'char', length: 36 }) roleId!: string;

  @ManyToOne(() => Business, (b) => b.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business!: Business;
  @Column({ name: 'business_id', type: 'char', length: 36 })
  businessId!: string;

  @Column({
    name: 'assigned_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  assignedAt!: Date;
}
