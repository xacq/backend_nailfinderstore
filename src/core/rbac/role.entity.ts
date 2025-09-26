// rbac/role.entity.ts
import { Column, Entity, Index } from 'typeorm';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { TimestampedEntity } from '../base/timestamped.entity';

@Entity('roles')
@Index('ux_roles_name', ['name'], { unique: true })
export class Role extends TimestampedEntity {
  @Column({ length: 50 })
  @IsString() @Length(1,50)
  name!: string;

  @Column({ length: 200, nullable: true })
  @IsOptional() @IsString()
  description?: string | null;

  @Column({ name: 'is_system', type: 'tinyint', default: () => 0 })
  @IsBoolean()
  isSystem!: boolean;
}
