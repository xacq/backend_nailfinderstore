// src/modules/scheduling/technicians/services/business-hours.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { BusinessHour } from '../entities/business-hour.entity';

@Injectable()
export class BusinessHoursService {
  constructor(@InjectRepository(BusinessHour) private readonly repo: Repository<BusinessHour>) {}

  async upsertDay(businessId: string, dto: { locationId?: string | null; weekday: number; opensAt: string; closesAt: string; isClosed?: boolean; }) {
    let row = await this.repo.findOne({ where: { businessId, locationId: dto.locationId ?? IsNull(), weekday: dto.weekday } });
    if (!row) row = this.repo.create({ businessId, ...dto });
    else Object.assign(row, dto);
    return this.repo.save(row); // weekday/opens_at/closes_at/is_closed. :contentReference[oaicite:61]{index=61}
  }
}
