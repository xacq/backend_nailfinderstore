// src/modules/scheduling/technicians/services/technicians.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Technician } from '../entities/technician.entity';
import { TechnicianService as TechService } from '../entities/technician-service.entity';

@Injectable()
export class TechniciansService {
  constructor(
    @InjectRepository(Technician) private readonly techRepo: Repository<Technician>,
    @InjectRepository(TechService) private readonly tsRepo: Repository<TechService>,
  ) {}

  create(businessId: string, dto: { displayName: string; userId?: string; bio?: string; specialization?: string }) {
    return this.techRepo.save(this.techRepo.create({ ...dto, businessId, isActive: true })); // :contentReference[oaicite:59]{index=59}
  }

  async assignServices(technicianId: string, serviceIds: string[]) {
    await this.tsRepo.delete({ technicianId });
    const rows = serviceIds.map(serviceId => this.tsRepo.create({ technicianId, serviceId }));
    return this.tsRepo.save(rows); // PK (technician_id, service_id). :contentReference[oaicite:60]{index=60}
  }
}
