// src/modules/scheduling/appointments/entities/appointment-status-history.entity.ts
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Appointment } from './appointment.entity';
import { User } from '../../../../core/user/user.entity';
import type { AppointmentStatus } from './appointment.entity';

@Entity('appointment_status_history')
@Index('fk_appointment_history_appointment', ['appointmentId'])
@Index('fk_appointment_history_changed_by', ['changedById'])
export class AppointmentStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Appointment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'appointment_id' })
  appointment!: Appointment;
  @Column({ name: 'appointment_id', type: 'char', length: 36 })
  appointmentId!: string; // :contentReference[oaicite:46]{index=46}

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
  })
  status!: AppointmentStatus; // :contentReference[oaicite:47]{index=47}
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'changed_by' })
  changedBy?: User | null;
  @Column({ name: 'changed_by', type: 'char', length: 36, nullable: true })
  changedById?: string | null; // :contentReference[oaicite:48]{index=48}
  @Column({
    name: 'changed_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  changedAt!: Date; // :contentReference[oaicite:49]{index=49}
  @Column({ length: 255, nullable: true }) notes?: string | null; // :contentReference[oaicite:50]{index=50}
}
