import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) phone: string;
  @Column({ nullable: true }) name: string;
  @Column({ nullable: true }) email: string;
  @Column({ type: 'varchar', default: UserRole.CUSTOMER }) role: UserRole;
  @Column({ default: false }) isVerified: boolean;
  @Column({ type: 'varchar', nullable: true, select: false }) otpHash?: string;
  @Column({ type: 'timestamp', nullable: true, select: false }) otpExpiresAt?: Date;
  @Column({ nullable: true }) tenantId: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
