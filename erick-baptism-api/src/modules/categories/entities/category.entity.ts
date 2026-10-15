import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' }) tenant: Tenant;
  @Column() tenantId: string;
  @Column() slug: string;
  @Column() titleSw: string;
  @Column() titleEn: string;
  @Column({ nullable: true }) descSw: string;
  @Column({ nullable: true }) descEn: string;
  @Column({ nullable: true }) imageUrl: string;
  @Column({ nullable: true }) icon: string;
  @Column({ default: 0 }) sortOrder: number;
  @Column({ default: true }) isActive: boolean;
  @OneToMany(() => Product, (p) => p.category) products: Product[];
  @CreateDateColumn() createdAt: Date;
}
