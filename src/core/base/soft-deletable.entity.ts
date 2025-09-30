// base/soft-deletable.entity.ts
import { DeleteDateColumn } from 'typeorm';
import { TimestampedEntity } from './timestamped.entity';

export abstract class SoftDeletableEntity extends TimestampedEntity {
  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date | null;
}
