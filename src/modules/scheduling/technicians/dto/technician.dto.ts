import { Technician } from '../entities/technician.entity';

export interface TechnicianSummaryDto {
  id: string;
  displayName: string;
  bio: string | null;
  specialization: string | null;
  ratingAverage: number | null;
  userId: string | null;
  isActive: boolean;
  serviceIds: string[];
}

export const toTechnicianSummaryDto = (
  technician: Technician,
  serviceIds: string[],
): TechnicianSummaryDto => ({
  id: technician.id,
  displayName: technician.displayName,
  bio: technician.bio ?? null,
  specialization: technician.specialization ?? null,
  ratingAverage: technician.ratingAverage ? Number(technician.ratingAverage) : null,
  userId: technician.userId ?? null,
  isActive: technician.isActive,
  serviceIds,
});
