import { Module } from '@nestjs/common';
import { CatalogModule } from './catalog/catalog.module';
import { TechniciansModule } from './technicians/technicians.module';

@Module({
  imports: [CatalogModule, TechniciansModule],
})
export class SchedulingModule {}
