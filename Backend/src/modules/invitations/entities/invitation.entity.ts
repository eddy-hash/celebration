import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';

export enum InvitationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DECLINED = 'declined',
}

@Entity('invitations')
export class Invitation {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' }) tenant: Tenant;
  @Column() tenantId: string;
  @Column() guestName: string;
  @Column() guestPhone: string;
  @Column({ nullable: true }) guestEmail: string;
  @Column({ default: 1 }) guestCount: number;
  @Column({ type: 'varchar', default: InvitationStatus.PENDING }) status: InvitationStatus;
  @Column({ nullable: true }) invitedBy: string;
  @Column({ nullable: true }) notes: string;
  @Column({ type: 'timestamp', nullable: true }) confirmedAt: Date;
  @Column({ type: 'timestamp', nullable: true }) declinedAt: Date;
  @Column({ unique: true }) inviteCode: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
