import {
  Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn,
} from 'typeorm';

export enum AuditAction {
  // Auth
  ADMIN_LOGIN = 'admin_login',
  ADMIN_LOGOUT = 'admin_logout',
  ADMIN_LOGIN_FAILED = 'admin_login_failed',
  GUEST_LOGIN = 'guest_login',
  GUEST_LOGIN_FAILED = 'guest_login_failed',

  // Invitations
  INVITE_CREATE = 'invite_create',
  INVITE_BULK_CREATE = 'invite_bulk_create',
  INVITE_DELETE = 'invite_delete',
  INVITE_SHARE = 'invite_share',
  INVITE_CONFIRM = 'invite_confirm',
  INVITE_DECLINE = 'invite_decline',

  // Orders
  ORDER_CREATE = 'order_create',
  ORDER_FULFILL = 'order_fulfill',
  ORDER_CANCEL = 'order_cancel',
  ORDER_MARK_PAID = 'order_mark_paid',

  // Payments
  PAYMENT_INITIATE = 'payment_initiate',
  PAYMENT_CONFIRM = 'payment_confirm',
  PAYMENT_VERIFY = 'payment_verify',
  PAYMENT_REJECT = 'payment_reject',

  // Uniforms
  UNIFORM_CREATE = 'uniform_create',
  UNIFORM_UPDATE = 'uniform_update',
  UNIFORM_DELIVER = 'uniform_deliver',
  UNIFORM_DISTRIBUTE = 'uniform_distribute',

  // Tenant
  TENANT_UPDATE = 'tenant_update',
  PRODUCT_CREATE = 'product_create',
  PRODUCT_UPDATE = 'product_update',
  PRODUCT_DELETE = 'product_delete',
}

@Entity('audit_logs')
@Index(['tenantId', 'createdAt'])
@Index(['action'])
@Index(['actorId'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ type: 'varchar' })
  action: AuditAction;

  @Column({ nullable: true }) tenantId: string;

  // Who did it
  @Column({ nullable: true }) actorId: string;
  @Column({ nullable: true }) actorName: string;
  @Column({ nullable: true }) actorRole: string; // guest | admin | super_admin
  @Column({ nullable: true }) actorPhone: string;

  // What was affected
  @Column({ nullable: true }) targetType: string; // invitation | order | payment | uniform | product
  @Column({ nullable: true }) targetId: string;
  @Column({ nullable: true }) targetName: string;

  // Context
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ type: 'simple-json', nullable: true }) metadata: any;

  // Request info
  @Column({ nullable: true }) ipAddress: string;
  @Column({ nullable: true }) userAgent: string;

  @CreateDateColumn() createdAt: Date;
}
