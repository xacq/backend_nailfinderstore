// src/modules/scheduling/technicians/entities/technician.entity.ts
import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { TimestampedEntity } from '../../base/timestamped.entity';
import { Business } from '../../../../core/business/business.entity';
import { User } from '../../../../core/user/user.entity';

@Entity('technicians')
@Index('fk_technicians_business', ['business'])
export class Technician extends TimestampedEntity {
  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  business!: Business;
  @Column({ name: 'business_id' }) businessId!: string;                // :contentReference[oaicite:17]{index=17}

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user?: User | null;
  @Column({ name: 'user_id', nullable: true }) userId?: string | null; // :contentReference[oaicite:18]{index=18}

  @Column({ name: 'display_name', length: 150 }) displayName!: string; // :contentReference[oaicite:19]{index=19}
  @Column({ type: 'text', nullable: true }) bio?: string | null;        // :contentReference[oaicite:20]{index=20}
  @Column({ length: 200, nullable: true }) specialization?: string | null; // :contentReference[oaicite:21]{index=21}
  @Column({ name: 'rating_average', type: 'decimal', precision: 3, scale: 2, nullable: true }) ratingAverage?: string | null; // :contentReference[oaicite:22]{index=22}
  @Column({ name: 'is_active', type: 'tinyint', default: () => 1 }) isActive!: boolean; // :contentReference[oaicite:23]{index=23}
}
