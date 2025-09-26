// src/modules/scheduling/appointments/services/reviews.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceReview } from '../entities/service-review.entity';
import { Technician } from '../../technicians/entities/technician.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ServiceReview) private readonly reviewRepo: Repository<ServiceReview>,
    @InjectRepository(Technician) private readonly techRepo: Repository<Technician>,
  ) {}

  async create(businessId: string, dto: { appointmentId?: string | null; serviceId: string; reviewerId: string; rating: number; comment?: string; }) {
    const saved = await this.reviewRepo.save(this.reviewRepo.create({ ...dto, businessId })); // :contentReference[oaicite:69]{index=69}
    // Recalcular promedio del técnico si la reseña está asociada a una cita
    await this.techRepo.query(`
      UPDATE technicians t
      JOIN (
        SELECT a.technician_id AS tech_id, AVG(sr.rating) avg_rating
        FROM service_reviews sr
        JOIN appointments a ON a.id = sr.appointment_id
        WHERE a.technician_id IS NOT NULL AND a.business_id = ?
        GROUP BY a.technician_id
      ) r ON r.tech_id = t.id
      SET t.rating_average = r.avg_rating
      WHERE t.business_id = ?`, [businessId, businessId]);
    return saved;
  }
}
