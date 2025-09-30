import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechniciansController } from './controllers/technicians.controller';
import { Technician } from './entities/technician.entity';
import { TechnicianService as TechnicianServiceEntity } from './entities/technician-service.entity';
import { TechniciansService } from './services/technicians.service';

@Module({
  imports: [TypeOrmModule.forFeature([Technician, TechnicianServiceEntity])],
  controllers: [TechniciansController],
  providers: [TechniciansService],
  exports: [TechniciansService],
})
export class TechniciansModule {}
