import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' }) tenant: Tenant;
  @Column() tenantId: string;
  @ManyToOne(() => Category, (c) => c.products, { onDelete: 'SET NULL', nullable: true }) category: Category;
  @Column({ nullable: true }) categoryId: string;
  @Column() sku: string;
  @Column() nameSw: string;
  @Column() nameEn: string;
  @Column({ type: 'text', nullable: true }) descSw: string;
  @Column({ type: 'text', nullable: true }) descEn: string;
  @Column({ type: 'int' }) price: number;
  @Column({ type: 'int', nullable: true }) comparePrice: number;
  @Column({ type: 'simple-json', default: '[]' }) images: string[];
  @Column({ type: 'simple-json', default: '["S","M","L","XL"]' }) sizes: string[];
  @Column({ type: 'simple-json', default: '["Black","Pink","White"]' }) colors: string[];
  @Column({ type: 'int', default: 0 }) stock: number;
  @Column({ default: true }) isActive: boolean;
  @Column({ default: false }) isFeatured: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
