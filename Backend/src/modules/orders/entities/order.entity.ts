import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';

export enum OrderStatus {
  PENDING = 'pending',
  AWAITING_PAYMENT = 'awaiting_payment',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  FULFILLED = 'fulfilled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) orderNumber: string;
  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' }) tenant: Tenant;
  @Column() tenantId: string;
  @Column({ type: 'varchar', default: OrderStatus.PENDING }) status: OrderStatus;
  @Column() customerName: string;
  @Column() customerPhone: string;
  @Column({ nullable: true }) customerEmail: string;
  @Column({ type: 'text', nullable: true }) deliveryAddress: string;
  @Column({ nullable: true }) region: string;
  @Column({ type: 'int' }) subtotal: number;
  @Column({ type: 'int', default: 0 }) shipping: number;
  @Column({ type: 'int', default: 0 }) discount: number;
  @Column({ type: 'int' }) total: number;
  @Column({ default: 'TZS' }) currency: string;
  @Column({ type: 'text', nullable: true }) notes: string;
  @Column({ type: 'timestamp', nullable: true }) paidAt: Date;
  @Column({ type: 'timestamp', nullable: true }) fulfilledAt: Date;
  @OneToMany(() => OrderItem, (i) => i.order, { cascade: true }) items: OrderItem[];
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => Order, (o) => o.items, { onDelete: 'CASCADE' }) order: Order;
  @Column() orderId: string;
  @Column() productId: string;
  @Column() productName: string;
  @Column({ nullable: true }) imageUrl: string;
  @Column({ nullable: true }) size: string;
  @Column({ nullable: true }) color: string;
  @Column({ type: 'int' }) unitPrice: number;
  @Column({ type: 'int' }) quantity: number;
  @Column({ type: 'int' }) lineTotal: number;
}
