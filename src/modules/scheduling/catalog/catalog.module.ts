import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogService } from './catalog.service';
import { ServiceCategory } from './entities/service-category.entity';
import { Service } from './entities/service.entity';
import { ServiceCategoriesController } from './controllers/service-categories.controller';
import { ServicesController } from './controllers/services.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCategory, Service])],
  providers: [CatalogService],
  controllers: [ServiceCategoriesController, ServicesController],
  exports: [CatalogService],
})
export class CatalogModule {}
