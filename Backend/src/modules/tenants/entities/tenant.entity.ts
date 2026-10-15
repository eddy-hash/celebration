import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) slug: string;
  @Column() honoreeName: string;
  @Column({ default: 'Baptism Celebration' }) eventType: string;
  @Column({ default: '#E91E63' }) brandColor: string;
  @Column({ nullable: true }) logoUrl: string;
  @Column({ nullable: true }) heroImageUrl: string;
  @Column({ default: '0710209220' }) phonePrimary: string;
  @Column({ default: '0692506552' }) phoneSecondary: string;
  @Column({ default: '255710209220' }) whatsappNumber: string;
  @Column({ default: '15714656' }) mixxBusinessNumber: string;
  @Column({ type: 'simple-json', default: '["mixx_by_yas","mpesa","airtel_money"]' }) enabledPayments: string[];
  @Column({ type: 'simple-json', default: '["0710209220","0692506552"]' }) adminPhones: string[];
  @Column({ default: 15 }) paymentExpiryMinutes: number;
  @Column({ default: 'sw' }) defaultLocale: string;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
