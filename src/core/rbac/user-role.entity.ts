// rbac/user-role.entity.ts
import { Column, Entity, Index, ManyToOne, Unique } from 'typeorm';
import { TimestampedEntity } from '../base/timestamped.entity';
import { User } from '../user/user.entity';
import { Role } from './role.entity';
import { Business } from '../business/business.entity';

@Entity('user_roles')
@Unique('ux_user_roles_assignment', ['userId', 'roleId', 'businessId'])
export class UserRole extends TimestampedEntity {
  @ManyToOne(() => User, u => u.roleAssignments, { onDelete: 'CASCADE' })
  @Index('fk_user_roles_user')
  user!: User;
  @Column({ name: 'user_id' }) userId!: string;

  @ManyToOne(() => Role, r => r.id, { onDelete: 'CASCADE' })
  @Index('fk_user_roles_role')
  role!: Role;
  @Column({ name: 'role_id' }) roleId!: string;

  @ManyToOne(() => Business, b => b.id, { onDelete: 'CASCADE' })
  @Index('fk_user_roles_business')
  business!: Business;
  @Column({ name: 'business_id' }) businessId!: string;

  @Column({ name: 'assigned_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt!: Date;
}
