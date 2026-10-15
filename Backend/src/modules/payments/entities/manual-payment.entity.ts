import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

export enum ManualPaymentStatus {
  PENDING = 'pending',
  AWAITING_VERIFICATION = 'awaiting_verification',
  SUCCESS = 'success',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

@Entity('manual_payments')
export class ManualPayment {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => Order, { onDelete: 'CASCADE' }) order: Order;
  @Column() orderId: string;
  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' }) tenant: Tenant;
  @Column() tenantId: string;
  @Column({ default: 'mixx_by_yas' }) provider: string;
  @Column({ type: 'varchar', default: ManualPaymentStatus.PENDING }) status: ManualPaymentStatus;
  @Column({ type: 'int' }) amount: number;
  @Column({ default: 'TZS' }) currency: string;
  @Column() customerPhone: string;
  @Column({ nullable: true }) customerName: string;
  @Column({ unique: true }) referenceCode: string;
  @Column() businessNumber: string;
  @Column({ type: 'timestamp', nullable: true }) customerConfirmedAt: Date;
  @Column({ type: 'timestamp', nullable: true }) verifiedAt: Date;
  @Column({ nullable: true }) verifiedBy: string;
  @Column({ nullable: true }) mixxTransactionId: string;
  @Column({ nullable: true }) screenshotUrl: string;
  @Column({ type: 'simple-json', nullable: true }) metadata: any;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
