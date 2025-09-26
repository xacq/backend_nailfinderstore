// user/user-address.entity.ts
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { TimestampedEntity } from '../base/timestamped.entity';
import { User } from './user.entity';
import { Business } from '../business/business.entity';

@Entity('user_addresses')
export class UserAddress extends TimestampedEntity {
  @ManyToOne(() => User, u => u.addresses, { onDelete: 'CASCADE' })
  @Index('fk_user_addresses_user')
  user!: User;
  @Column({ name: 'user_id' }) userId!: string;

  @ManyToOne(() => Business, { nullable: true, onDelete: 'SET NULL' })
  @Index('fk_user_addresses_business')
  business?: Business | null;
  @Column({ name: 'business_id', nullable: true }) businessId?: string | null;

  @Column({ length: 100, nullable: true })
  @IsOptional() @IsString() @Length(1,100)
  label?: string | null;

  @Column({ name: 'address_line1', length: 200 })
  @IsString() @Length(1,200)
  addressLine1!: string;

  @Column({ name: 'address_line2', length: 200, nullable: true })
  @IsOptional() @IsString()
  addressLine2?: string | null;

  @Column({ length: 100 })
  @IsString() @Length(1,100)
  city!: string;

  @Column({ length: 100, nullable: true })
  @IsOptional() @IsString()
  state?: string | null;

  @Column({ name: 'postal_code', length: 20, nullable: true })
  @IsOptional() @IsString()
  postalCode?: string | null;

  @Column({ length: 100 })
  @IsString() @Length(1,100)
  country!: string;

  @Column({ name: 'is_default', type: 'tinyint', default: () => 0 })
  @IsBoolean()
  isDefault!: boolean;
}
