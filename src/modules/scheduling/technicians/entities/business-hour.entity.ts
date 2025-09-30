// src/modules/scheduling/technicians/entities/business-hour.entity.ts
import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { TimestampedEntity } from '../../base/timestamped.entity';
import { Business } from '../../../../core/business/business.entity';
import { BusinessLocation } from '../../../../core/business/business-location.entity';

@Entity('business_hours')
@Index('fk_business_hours_business', ['businessId'])
export class BusinessHour extends TimestampedEntity {
  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business!: Business;
  @Column({ name: 'business_id', type: 'char', length: 36 })
  businessId!: string; // :contentReference[oaicite:24]{index=24}

  @ManyToOne(() => BusinessLocation, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' })
  location?: BusinessLocation | null;
  @Column({ name: 'location_id', type: 'char', length: 36, nullable: true })
  locationId?: string | null; // :contentReference[oaicite:25]{index=25}

  @Column({ type: 'tinyint' }) weekday!: number; // 0..6 o 1..7 según convención  :contentReference[oaicite:26]{index=26}
  @Column({ name: 'opens_at', type: 'time' }) opensAt!: string; // HH:MM:SS  :contentReference[oaicite:27]{index=27}
  @Column({ name: 'closes_at', type: 'time' }) closesAt!: string; // HH:MM:SS  :contentReference[oaicite:28]{index=28}
  @Column({ name: 'is_closed', type: 'tinyint', default: () => '0' })
  isClosed!: boolean; // :contentReference[oaicite:29]{index=29}
}
