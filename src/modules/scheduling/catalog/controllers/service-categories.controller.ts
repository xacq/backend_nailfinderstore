import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { CatalogService } from '../catalog.service';
import { ListServiceCategoriesQueryDto } from '../dto/list-service-categories-query.dto';
import { ServiceCategoryDto, toServiceCategoryDto } from '../dto/service-category.dto';

@Controller('businesses/:businessId/service-categories')
export class ServiceCategoriesController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  async list(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query() query: ListServiceCategoriesQueryDto,
  ): Promise<ServiceCategoryDto[]> {
    const categories = await this.catalogService.listCategories(businessId, {
      includeInactive: query.includeInactive,
    });

    return categories.map(toServiceCategoryDto);
  }
}
