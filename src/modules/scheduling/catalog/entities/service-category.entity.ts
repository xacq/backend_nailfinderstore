// src/modules/scheduling/catalog/entities/service-category.entity.ts
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { TimestampedEntity } from '../../base/timestamped.entity';
// Importa tu entidad Business real:
import { Business } from '../../../../core/business/business.entity';

@Entity('service_categories')
@Index('fk_service_categories_business', ['business'])
export class ServiceCategory extends TimestampedEntity {
  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  business!: Business;

  @Column({ name: 'business_id' }) businessId!: string;

  @Column({ length: 150 }) name!: string;                // :contentReference[oaicite:6]{index=6}
  @Column({ type: 'text', nullable: true }) description?: string | null; // :contentReference[oaicite:7]{index=7}
  @Column({ type: 'int', default: 0 }) position!: number;               // :contentReference[oaicite:8]{index=8}
  @Column({ name: 'is_active', type: 'tinyint', default: () => 1 }) isActive!: boolean; // :contentReference[oaicite:9]{index=9}
}
