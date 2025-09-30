// business/business-location.entity.ts
import { Column, Entity, ManyToOne, Index, JoinColumn } from 'typeorm';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { SoftDeletableEntity } from '../base/soft-deletable.entity';
import { Business } from './business.entity';

@Entity('business_locations')
@Index('fk_business_locations_business', ['businessId'])
export class BusinessLocation extends SoftDeletableEntity {
  @ManyToOne(() => Business, (b) => b.locations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business!: Business;

  @Column({ name: 'business_id', type: 'char', length: 36 })
  businessId!: string;

  @Column({ length: 150 })
  @IsString()
  @Length(1, 150)
  name!: string;

  @Column({ name: 'address_line1', length: 200 })
  @IsString()
  @Length(1, 200)
  addressLine1!: string;

  @Column({
    name: 'address_line2',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  addressLine2?: string | null;

  @Column({ length: 100 })
  @IsString()
  @Length(1, 100)
  city!: string;

  @Column({ length: 100, nullable: true })
  @IsOptional()
  @IsString()
  state?: string | null;

  @Column({ name: 'postal_code', length: 20, nullable: true })
  @IsOptional()
  @IsString()
  postalCode?: string | null;

  @Column({ length: 100 })
  @IsString()
  @Length(1, 100)
  country!: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: string | null;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: string | null;

  @Column({ length: 30, nullable: true })
  @IsOptional()
  @IsString()
  phone?: string | null;

  @Column({ length: 150, nullable: true })
  @IsOptional()
  @IsString()
  email?: string | null;

  @Column({ name: 'is_default', type: 'tinyint', default: () => '0' })
  @IsBoolean()
  isDefault!: boolean;

  @Column({ name: 'is_active', type: 'tinyint', default: () => '1' })
  @IsBoolean()
  isActive!: boolean;
}
