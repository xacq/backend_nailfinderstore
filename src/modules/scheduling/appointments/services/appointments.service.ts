// src/modules/scheduling/appointments/services/appointments.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, IsNull, Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { AppointmentStatusHistory } from '../entities/appointment-status-history.entity';
import { Service } from '../../catalog/entities/service.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectDataSource() private readonly ds: DataSource,
    @InjectRepository(Appointment) private readonly apptRepo: Repository<Appointment>,
    @InjectRepository(AppointmentStatusHistory) private readonly histRepo: Repository<AppointmentStatusHistory>,
    @InjectRepository(Service) private readonly serviceRepo: Repository<Service>,
  ) {}

  private windows(svc: Service, start: Date) {
    const prep = (svc.preparationTimeMinutes ?? 0) * 60_000;
    const dur  =  svc.durationMinutes * 60_000;
    const buff = (svc.bufferTimeMinutes ?? 0) * 60_000;
    return {
      serviceStart: start,
      serviceEnd: new Date(start.getTime() + dur),
      blockedStart: new Date(start.getTime() - prep),
      blockedEnd: new Date(start.getTime() + dur + buff),
    };
  }

  book(dto: { businessId: string; locationId?: string | null; serviceId: string; technicianId: string; clientId: string; startTime: Date; notes?: string; }, actorUserId: string) {
    return this.ds.transaction(async (trx) => {
      const svc = await trx.getRepository(Service).findOneBy({ id: dto.serviceId, businessId: dto.businessId, deletedAt: IsNull() });
      if (!svc) throw new NotFoundException('Servicio no encontrado'); // :contentReference[oaicite:66]{index=66}

      const { serviceStart, serviceEnd, blockedStart, blockedEnd } = this.windows(svc, dto.startTime);

      const exist = await trx.getRepository(Appointment).createQueryBuilder('a')
        .where('a.technicianId = :tech', { tech: dto.technicianId })
        .andWhere('a.status IN (:...st)', { st: ['pending','confirmed'] })
        .andWhere(':bs < a.endTime AND :be > a.startTime', { bs: blockedStart, be: blockedEnd })
        .getExists();
      if (exist) throw new ConflictException('Solapamiento con otra cita'); // :contentReference[oaicite:67]{index=67}

      const appt = trx.getRepository(Appointment).create({
        businessId: dto.businessId,
        locationId: dto.locationId ?? null,
        serviceId: dto.serviceId,
        technicianId: dto.technicianId,
        clientId: dto.clientId,
        startTime: serviceStart,
        endTime: serviceEnd,
        status: 'pending',
        notes: dto.notes ?? null,
        price: svc.price,
      });
      const saved = await trx.getRepository(Appointment).save(appt);

      await trx.getRepository(AppointmentStatusHistory).save(
        trx.getRepository(AppointmentStatusHistory).create({
          appointmentId: saved.id, status: 'pending', changedById: actorUserId, notes: 'Creación',
        }),
      ); // :contentReference[oaicite:68]{index=68}

      return saved;
    });
  }

  async updateStatus(appointmentId: string, newStatus: 'pending'|'confirmed'|'completed'|'cancelled'|'no_show', actorUserId: string, notes?: string) {
    return this.ds.transaction(async (trx) => {
      const appt = await trx.getRepository(Appointment).findOneBy({ id: appointmentId });
      if (!appt) throw new NotFoundException('Cita no encontrada');
      appt.status = newStatus;
      if (newStatus === 'cancelled') appt.cancelledAt = new Date();
      await trx.getRepository(Appointment).save(appt);

      await trx.getRepository(AppointmentStatusHistory).save(
        trx.getRepository(AppointmentStatusHistory).create({
          appointmentId, status: newStatus, changedById: actorUserId, notes: notes ?? null,
        }),
      );
      return appt;
    });
  }
}
