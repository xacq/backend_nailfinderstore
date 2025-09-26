// src/modules/scheduling/catalog/services/services.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Service } from '../entities/service.entity';
import { ServiceCategory } from '../entities/service-category.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service) private readonly repo: Repository<Service>,
    @InjectRepository(ServiceCategory) private readonly catRepo: Repository<ServiceCategory>,
  ) {}

  async create(businessId: string, dto: {
    categoryId: string; name: string; description?: string;
    durationMinutes: number; price: number;
    preparationTimeMinutes?: number; bufferTimeMinutes?: number; isActive?: boolean;
  }) {
    const cat = await this.catRepo.findOneBy({ id: dto.categoryId, businessId });
    if (!cat) throw new NotFoundException('Categoría no encontrada');
    const s = this.repo.create({
      ...dto,
      businessId,
      isActive: dto.isActive ?? true,
      price: String(dto.price), // Ensure price is a string
    });
    return this.repo.save(s); // `deleted_at` existe y lo manejas como soft-delete. :contentReference[oaicite:58]{index=58}
  }

  list(businessId: string) {
    return this.repo.find({ where: { businessId, deletedAt: IsNull() } });
  }

  async update(businessId: string, id: string, dto: Partial<Service>) {
    const s = await this.repo.findOneBy({ id, businessId });
    if (!s) throw new NotFoundException('Servicio no encontrado');
    Object.assign(s, dto);
    return this.repo.save(s);
  }

  async softDelete(businessId: string, id: string) {
    const s = await this.repo.findOneBy({ id, businessId });
    if (!s) throw new NotFoundException('Servicio no encontrado');
    s.deletedAt = new Date();
    return this.repo.save(s);
  }
}
