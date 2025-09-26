// src/modules/scheduling/catalog/entities/service.entity.ts
import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { SoftDeletableEntity } from '../../base/soft-deletable.entity';
import { Business } from '../../../../core/business/business.entity';
import { ServiceCategory } from './service-category.entity';

@Entity('services')
@Index('fk_services_business', ['business'])
@Index('fk_services_category', ['category'])
export class Service extends SoftDeletableEntity {
  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  business!: Business;
  @Column({ name: 'business_id' }) businessId!: string;

  @ManyToOne(() => ServiceCategory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category!: ServiceCategory;
  @Column({ name: 'category_id' }) categoryId!: string;

  @Column({ length: 150 }) name!: string;                 // :contentReference[oaicite:10]{index=10}
  @Column({ type: 'text', nullable: true }) description?: string | null; // :contentReference[oaicite:11]{index=11}
  @Column({ name: 'duration_minutes', type: 'int' }) durationMinutes!: number; // :contentReference[oaicite:12]{index=12}
  @Column({ type: 'decimal', precision: 10, scale: 2 }) price!: string;       // :contentReference[oaicite:13]{index=13}
  @Column({ name: 'preparation_time_minutes', type: 'int', default: 0 }) preparationTimeMinutes!: number; // :contentReference[oaicite:14]{index=14}
  @Column({ name: 'buffer_time_minutes', type: 'int', default: 0 }) bufferTimeMinutes!: number; // :contentReference[oaicite:15]{index=15}
  @Column({ name: 'is_active', type: 'tinyint', default: () => 1 }) isActive!: boolean; // :contentReference[oaicite:16]{index=16}
}
