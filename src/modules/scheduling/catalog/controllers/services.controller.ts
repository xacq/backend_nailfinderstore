import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { CatalogService } from '../catalog.service';
import { ListServicesQueryDto } from '../dto/list-services-query.dto';
import { ServiceDto, toServiceDto } from '../dto/service.dto';

@Controller('businesses/:businessId/services')
export class ServicesController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  async list(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query() query: ListServicesQueryDto,
  ): Promise<ServiceDto[]> {
    const services = await this.catalogService.listServices(businessId, {
      includeInactive: query.includeInactive,
      categoryId: query.categoryId,
    });

    return services.map(toServiceDto);
  }
}
