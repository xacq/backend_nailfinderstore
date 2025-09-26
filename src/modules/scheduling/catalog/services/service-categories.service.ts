// src/modules/scheduling/catalog/services/service-categories.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ServiceCategory } from '../entities/service-category.entity';
import { Service } from '../entities/service.entity';

@Injectable()
export class ServiceCategoriesService {
  constructor(
    @InjectRepository(ServiceCategory) private readonly repo: Repository<ServiceCategory>,
    @InjectRepository(Service) private readonly serviceRepo: Repository<Service>,
  ) {}

  create(businessId: string, dto: { name: string; description?: string; position?: number; isActive?: boolean; }) {
    const cat = this.repo.create({ ...dto, businessId, isActive: dto.isActive ?? true });
    return this.repo.save(cat); // FK → businesses(id). :contentReference[oaicite:57]{index=57}
  }

  findAll(businessId: string) {
    return this.repo.find({ where: { businessId }, order: { position: 'ASC', name: 'ASC' } });
  }

  async update(businessId: string, id: string, dto: Partial<ServiceCategory>) {
    const cat = await this.repo.findOneBy({ id, businessId });
    if (!cat) throw new NotFoundException('Categoría no encontrada');
    Object.assign(cat, dto);
    return this.repo.save(cat);
  }

  async remove(businessId: string, id: string) {
    const count = await this.serviceRepo.count({ where: { businessId, categoryId: id, deletedAt: IsNull() } });
    if (count > 0) throw new BadRequestException('La categoría tiene servicios asociados activos');
    await this.repo.delete({ id, businessId });
  }
}

