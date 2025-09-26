// src/modules/scheduling/appointments/entities/appointment.entity.ts
import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { TimestampedEntity } from '../../base/timestamped.entity';
import { Business } from '../../../../core/business/business.entity';
import { BusinessLocation } from '../../../../core/business/business-location.entity';
import { Service } from '../../catalog/entities/service.entity';
import { Technician } from '../../technicians/entities/technician.entity';
import { User } from '../../../../core/user/user.entity';

export type AppointmentStatus = 'pending'|'confirmed'|'completed'|'cancelled'|'no_show';

@Entity('appointments')
@Index('fk_appointments_business', ['business'])
export class Appointment extends TimestampedEntity {
  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  business!: Business;
  @Column({ name: 'business_id' }) businessId!: string;             // :contentReference[oaicite:34]{index=34}

  @ManyToOne(() => BusinessLocation, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' })
  location?: BusinessLocation | null;
  @Column({ name: 'location_id', nullable: true }) locationId?: string | null; // :contentReference[oaicite:35]{index=35}

  @ManyToOne(() => Service, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service!: Service;
  @Column({ name: 'service_id' }) serviceId!: string;               // :contentReference[oaicite:36]{index=36}

  @ManyToOne(() => Technician, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'technician_id' })
  technician!: Technician;
  @Column({ name: 'technician_id' }) technicianId!: string;         // :contentReference[oaicite:37]{index=37}

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client!: User;
  @Column({ name: 'client_id' }) clientId!: string;                 // :contentReference[oaicite:38]{index=38}

  @Column({ name: 'start_time', type: 'timestamp' }) startTime!: Date; // :contentReference[oaicite:39]{index=39}
  @Column({ name: 'end_time', type: 'timestamp' }) endTime!: Date;     // :contentReference[oaicite:40]{index=40}
  @Column({ type: 'enum', enum: ['pending','confirmed','completed','cancelled','no_show'], default: 'pending' })
  status!: AppointmentStatus;                                        // :contentReference[oaicite:41]{index=41}
  @Column({ type: 'text', nullable: true }) notes?: string | null;   // :contentReference[oaicite:42]{index=42}
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) price?: string | null; // :contentReference[oaicite:43]{index=43}
  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true }) cancelledAt?: Date | null; // :contentReference[oaicite:44]{index=44}
  @Column({ name: 'cancellation_reason', length: 255, nullable: true }) cancellationReason?: string | null; // :contentReference[oaicite:45]{index=45}
}
