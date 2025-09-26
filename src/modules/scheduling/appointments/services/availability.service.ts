// src/modules/scheduling/appointments/services/availability.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, IsNull, Repository } from 'typeorm';
import { BusinessHour } from '../../technicians/entities/business-hour.entity';
import { TechnicianAvailability } from '../../technicians/entities/technician-availability.entity';
import { TechnicianService } from '../../technicians/entities/technician-service.entity';
import { Service } from '../../catalog/entities/service.entity';
import { Appointment } from '../entities/appointment.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(BusinessHour) private readonly bhRepo: Repository<BusinessHour>,
    @InjectRepository(TechnicianAvailability) private readonly taRepo: Repository<TechnicianAvailability>,
    @InjectRepository(TechnicianService) private readonly tsRepo: Repository<TechnicianService>,
    @InjectRepository(Service) private readonly serviceRepo: Repository<Service>,
    @InjectRepository(Appointment) private readonly apptRepo: Repository<Appointment>,
  ) {}

  private weekday(d: Date) { return (d.getUTCDay() + 6) % 7; }

  async listSlots(params: { businessId: string; technicianId: string; serviceId: string; date: string; locationId?: string | null; stepMinutes?: number; }) {
    const step = params.stepMinutes ?? 15;
    const offer = await this.tsRepo.findOneBy({ technicianId: params.technicianId, serviceId: params.serviceId });
    if (!offer) return [];

    const svc = await this.serviceRepo.findOneByOrFail({ id: params.serviceId, businessId: params.businessId, deletedAt: IsNull() }); // :contentReference[oaicite:62]{index=62}
    const day = new Date(`${params.date}T00:00:00Z`);
    const wd = this.weekday(day);

    const bh = await this.bhRepo.find({ where: { businessId: params.businessId, locationId: params.locationId ?? IsNull(), weekday: wd } }); // :contentReference[oaicite:63]{index=63}
    const av = await this.taRepo.find({ where: { technicianId: params.technicianId, weekday: wd } }); // :contentReference[oaicite:64]{index=64}

    const open = bh.filter(b => !b.isClosed).map(b => ({ start: b.opensAt, end: b.closesAt }));
    if (open.length === 0) return [];

    const dayStart = new Date(`${params.date}T00:00:00Z`);
    const dayEnd = new Date(`${params.date}T23:59:59Z`);
    const appts = await this.apptRepo.find({
      where: { technicianId: params.technicianId, status: In(['pending','confirmed']), startTime: Between(dayStart, dayEnd) },
      order: { startTime: 'ASC' },
    }); // :contentReference[oaicite:65]{index=65}

    const busy = appts.map(a => {
      const prep = (svc.preparationTimeMinutes ?? 0) * 60_000;
      const buff = (svc.bufferTimeMinutes ?? 0) * 60_000;
      return { start: new Date(a.startTime.getTime() - prep), end: new Date(a.endTime.getTime() + buff) };
    });

    const ranges = intersectRanges(open, av.map(x => ({ start: x.startTime, end: x.endTime })));
    const needMs = ((svc.preparationTimeMinutes ?? 0) + svc.durationMinutes + (svc.bufferTimeMinutes ?? 0)) * 60_000;

    const slots: string[] = [];
    for (const r of ranges) {
      for (let t = toDate(params.date, r.start); t.getTime() + needMs <= toDate(params.date, r.end).getTime(); t = new Date(t.getTime() + step * 60_000)) {
        const blockedStart = new Date(t.getTime() - (svc.preparationTimeMinutes ?? 0) * 60_000);
        const blockedEnd = new Date(t.getTime() + svc.durationMinutes * 60_000 + (svc.bufferTimeMinutes ?? 0) * 60_000);
        if (!busy.some(b => blockedStart < b.end && blockedEnd > b.start)) slots.push(t.toISOString());
      }
    }
    return slots;
  }
}
function toDate(d: string, hhmmss: string) { return new Date(`${d}T${hhmmss}Z`); }
function intersectRanges(a: {start:string;end:string}[], b: {start:string;end:string}[]) {
  const out: {start:string;end:string}[] = [];
  for (const A of a) for (const B of b) {
    const s = A.start > B.start ? A.start : B.start;
    const e = A.end   < B.end   ? A.end   : B.end;
    if (s < e) out.push({ start: s, end: e });
  }
  return out;
}
