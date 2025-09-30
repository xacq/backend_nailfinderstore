// src/modules/scheduling/appointments/entities/service-review.entity.ts
import { Column, Entity, ManyToOne, JoinColumn, Index } from 'typeorm';
import { TimestampedEntity } from '../../base/timestamped.entity';
import { Business } from '../../../../core/business/business.entity';
import { Appointment } from './appointment.entity';
import { Service } from '../../catalog/entities/service.entity';
import { User } from '../../../../core/user/user.entity';

@Entity('service_reviews')
@Index('fk_service_reviews_business', ['businessId'])
@Index('fk_service_reviews_appointment', ['appointmentId'])
@Index('fk_service_reviews_service', ['serviceId'])
@Index('fk_service_reviews_reviewer', ['reviewerId'])
export class ServiceReview extends TimestampedEntity {
  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business!: Business;
  @Column({ name: 'business_id', type: 'char', length: 36 })
  businessId!: string; // :contentReference[oaicite:51]{index=51}

  @ManyToOne(() => Appointment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'appointment_id' })
  appointment?: Appointment | null;
  @Column({ name: 'appointment_id', type: 'char', length: 36, nullable: true })
  appointmentId?: string | null; // :contentReference[oaicite:52]{index=52}

  @ManyToOne(() => Service, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service!: Service;
  @Column({ name: 'service_id', type: 'char', length: 36 }) serviceId!: string; // :contentReference[oaicite:53]{index=53}

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer!: User;
  @Column({ name: 'reviewer_id', type: 'char', length: 36 })
  reviewerId!: string; // :contentReference[oaicite:54]{index=54}

  @Column({ type: 'tinyint' }) rating!: number; // 1..5 CHECK  :contentReference[oaicite:55]{index=55}
  @Column({ type: 'text', nullable: true }) comment?: string | null; // :contentReference[oaicite:56]{index=56}
}
