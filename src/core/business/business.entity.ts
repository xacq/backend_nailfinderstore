import { Column, Entity, Index, OneToMany } from 'typeorm';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { SoftDeletableEntity } from '../base/soft-deletable.entity';
import { BusinessLocation } from './business-location.entity';
import { User } from '../user/user.entity';
import { BusinessUser } from '../rbac/business-user.entity';

@Entity('businesses')
@Index('ux_businesses_name', ['name'], { unique: true })
export class Business extends SoftDeletableEntity {
  @Column({ length: 150 })
  @IsString()
  @Length(1, 150)
  name!: string;

  @Column({ name: 'legal_name', length: 150, nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 150)
  legalName?: string | null;

  @Column({ name: 'tax_id', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  taxId?: string | null;

  @Column({ length: 150, nullable: true })
  @IsOptional()
  @IsString()
  email?: string | null;

  @Column({ length: 30, nullable: true })
  @IsOptional()
  @IsString()
  phone?: string | null;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @Column({ name: 'logo_url', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  logoUrl?: string | null;

  @Column({ name: 'cover_image_url', length: 500, nullable: true })
  @IsOptional()
  @IsString()
  coverImageUrl?: string | null;

  @Column({ length: 50, default: 'UTC' })
  @IsString()
  @Length(1, 50)
  timezone!: string;

  @Column({ length: 3, default: 'USD' })
  @IsString()
  @Length(1, 3)
  currency!: string;

  @Column({ name: 'is_active', type: 'tinyint', default: () => '1' })
  @IsBoolean()
  isActive!: boolean;

  // Relaciones clave del núcleo
  @OneToMany(() => BusinessLocation, (bl) => bl.business, { cascade: false })
  locations!: BusinessLocation[];

  @OneToMany(() => User, (u) => u.defaultBusiness)
  defaultBusinessUsers!: User[];

  @OneToMany(() => BusinessUser, (bu) => bu.business)
  businessUsers!: BusinessUser[];
}
