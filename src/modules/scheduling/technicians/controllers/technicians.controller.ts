import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { TechniciansService } from '../services/technicians.service';
import { ListTechniciansQueryDto } from '../dto/list-technicians-query.dto';
import { TechnicianSummaryDto, toTechnicianSummaryDto } from '../dto/technician.dto';

@Controller('businesses/:businessId/technicians')
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) {}

  @Get()
  async list(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query() query: ListTechniciansQueryDto,
  ): Promise<TechnicianSummaryDto[]> {
    const technicians = await this.techniciansService.listByBusiness(businessId, {
      includeInactive: query.includeInactive,
      serviceId: query.serviceId,
    });

    return technicians.map(item => toTechnicianSummaryDto(item.technician, item.serviceIds));
  }
}
