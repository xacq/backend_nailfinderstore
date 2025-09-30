// src/modules/scheduling/technicians/entities/technician-service.entity.ts
import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Service } from '../../catalog/entities/service.entity';
import { Technician } from './technician.entity';

@Entity('technician_services')
export class TechnicianService {
  @PrimaryColumn({ name: 'technician_id', type: 'char', length: 36 })
  technicianId!: string;

  @PrimaryColumn({ name: 'service_id', type: 'char', length: 36 })
  serviceId!: string;

  @ManyToOne(() => Technician, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'technician_id' })
  technician!: Technician;

  @ManyToOne(() => Service, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service!: Service;
}
