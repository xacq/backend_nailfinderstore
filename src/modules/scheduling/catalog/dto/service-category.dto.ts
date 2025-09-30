import { ServiceCategory } from '../entities/service-category.entity';

export interface ServiceCategoryDto {
  id: string;
  name: string;
  description: string | null;
  position: number;
  isActive: boolean;
}

export const toServiceCategoryDto = (entity: ServiceCategory): ServiceCategoryDto => ({
  id: entity.id,
  name: entity.name,
  description: entity.description ?? null,
  position: entity.position,
  isActive: entity.isActive,
});
