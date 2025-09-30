import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ServiceCategory } from './entities/service-category.entity';
import { Service } from './entities/service.entity';

interface ListCategoriesOptions {
  includeInactive?: boolean;
}

interface ListServicesOptions {
  includeInactive?: boolean;
  categoryId?: string;
}

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(ServiceCategory) private readonly categoryRepo: Repository<ServiceCategory>,
    @InjectRepository(Service) private readonly serviceRepo: Repository<Service>,
  ) {}

  listCategories(businessId: string, options: ListCategoriesOptions = {}) {
    const where: FindOptionsWhere<ServiceCategory> = { businessId };
    if (!options.includeInactive) {
      where.isActive = true;
    }

    return this.categoryRepo.find({
      where,
      order: { position: 'ASC', name: 'ASC' },
    });
  }

  listServices(businessId: string, options: ListServicesOptions = {}) {
    const where: FindOptionsWhere<Service> = { businessId };

    if (!options.includeInactive) {
      where.isActive = true;
    }

    if (options.categoryId) {
      where.categoryId = options.categoryId;
    }

    return this.serviceRepo.find({
      where,
      order: { name: 'ASC' },
    });
  }
}
