import { Service } from '../entities/service.entity';

export interface ServiceDto {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: string;
  preparationTimeMinutes: number;
  bufferTimeMinutes: number;
  isActive: boolean;
}

export const toServiceDto = (entity: Service): ServiceDto => ({
  id: entity.id,
  categoryId: entity.categoryId,
  name: entity.name,
  description: entity.description ?? null,
  durationMinutes: entity.durationMinutes,
  price: entity.price,
  preparationTimeMinutes: entity.preparationTimeMinutes,
  bufferTimeMinutes: entity.bufferTimeMinutes,
  isActive: entity.isActive,
});
