// src/modules/scheduling/technicians/services/technicians.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Technician } from '../entities/technician.entity';
import { TechnicianService as TechService } from '../entities/technician-service.entity';

export interface TechnicianWithServices {
  technician: Technician;
  serviceIds: string[];
}

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

  async listByBusiness(
    businessId: string,
    options: { includeInactive?: boolean; serviceId?: string } = {},
  ): Promise<TechnicianWithServices[]> {
    const technicians = await this.techRepo.find({
      where: {
        businessId,
        ...(options.includeInactive ? {} : { isActive: true }),
      },
      order: { displayName: 'ASC', createdAt: 'ASC' },
    });

    if (!technicians.length) {
      return [];
    }

    const assignments = await this.tsRepo.find({
      where: { technicianId: In(technicians.map(tech => tech.id)) },
    });

    const assignmentsByTechnician = new Map<string, string[]>();
    for (const assignment of assignments) {
      if (!assignmentsByTechnician.has(assignment.technicianId)) {
        assignmentsByTechnician.set(assignment.technicianId, []);
      }
      assignmentsByTechnician.get(assignment.technicianId)!.push(assignment.serviceId);
    }

    const filteredTechnicians = options.serviceId
      ? technicians.filter(tech => (assignmentsByTechnician.get(tech.id) ?? []).includes(options.serviceId!))
      : technicians;

    return filteredTechnicians.map(technician => ({
      technician,
      serviceIds: assignmentsByTechnician.get(technician.id) ?? [],
    }));
  }
}
