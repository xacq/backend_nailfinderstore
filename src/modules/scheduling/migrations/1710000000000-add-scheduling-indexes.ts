import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSchedulingIndexes1710000000000 implements MigrationInterface {
  name = 'AddSchedulingIndexes1710000000000';

  public async up(qr: QueryRunner): Promise<void> {
    await qr.query(`CREATE INDEX idx_appointments_tech_time_status ON appointments (technician_id, start_time, end_time, status)`); // búsquedas de solape :contentReference[oaicite:70]{index=70}
    await qr.query(`CREATE INDEX idx_tech_availability_key ON technician_availability (technician_id, weekday, start_time)`);       // slots por día :contentReference[oaicite:71]{index=71}
    await qr.query(`CREATE INDEX idx_business_hours_key ON business_hours (business_id, location_id, weekday)`);                    // lookup rápido :contentReference[oaicite:72]{index=72}
    await qr.query(`CREATE INDEX idx_services_catalog ON services (business_id, category_id, is_active)`);                          // catálogos :contentReference[oaicite:73]{index=73}
  }

  public async down(qr: QueryRunner): Promise<void> {
    await qr.query(`DROP INDEX idx_services_catalog ON services`);
    await qr.query(`DROP INDEX idx_business_hours_key ON business_hours`);
    await qr.query(`DROP INDEX idx_tech_availability_key ON technician_availability`);
    await qr.query(`DROP INDEX idx_appointments_tech_time_status ON appointments`);
  }
}
