import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';

export enum UniformStatus {
  NOT_ORDERED = 'not_ordered',
  ORDERED = 'ordered',
  DELIVERED = 'delivered',
  DISTRIBUTED = 'distributed',
}

@Entity('uniforms')
export class Uniform {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' }) tenant: Tenant;
  @Column() tenantId: string;
  @Column() guestName: string;
  @Column({ nullable: true }) guestPhone: string;
  @Column({ nullable: true }) invitationId: string;
  @Column({ nullable: true }) size: string;
  @Column({ nullable: true }) color: string;
  @Column({ default: 1 }) quantity: number;
  @Column({ type: 'varchar', default: UniformStatus.NOT_ORDERED }) status: UniformStatus;
  @Column({ type: 'int', default: 0 }) cost: number;
  @Column({ nullable: true }) paidBy: string;
  @Column({ type: 'timestamp', nullable: true }) distributedAt: Date;
  @Column({ nullable: true }) notes: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
