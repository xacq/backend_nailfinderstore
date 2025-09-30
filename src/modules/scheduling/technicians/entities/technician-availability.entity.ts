// src/modules/scheduling/technicians/entities/technician-availability.entity.ts
import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { TimestampedEntity } from '../../base/timestamped.entity';
import { Technician } from './technician.entity';

@Entity('technician_availability')
@Index('fk_technician_availability_technician', ['technicianId'])
export class TechnicianAvailability extends TimestampedEntity {
  @ManyToOne(() => Technician, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'technician_id' })
  technician!: Technician;
  @Column({ name: 'technician_id', type: 'char', length: 36 })
  technicianId!: string; // :contentReference[oaicite:30]{index=30}

  @Column({ type: 'tinyint' }) weekday!: number; // :contentReference[oaicite:31]{index=31}
  @Column({ name: 'start_time', type: 'time' }) startTime!: string; // HH:MM:SS  :contentReference[oaicite:32]{index=32}
  @Column({ name: 'end_time', type: 'time' }) endTime!: string; // HH:MM:SS  :contentReference[oaicite:33]{index=33}
}
