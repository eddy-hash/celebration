import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { config } from 'dotenv';
config({ path: join(process.cwd(), '.env') });

import { Tenant } from '../../modules/tenants/entities/tenant.entity';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { Category } from '../../modules/categories/entities/category.entity';
import { Product } from '../../modules/products/entities/product.entity';

const ds = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_DATABASE || 'erick_baptism',
  entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
  synchronize: true,
  logging: ['error'],
});

async function run() {
  console.log(`🔌 Connecting to ${process.env.DB_HOST}:${process.env.DB_PORT} as ${process.env.DB_USERNAME}...`);
  await ds.initialize();
  console.log('✅ Connected!');
  console.log('🌱 Seeding...');

  const tenantRepo = ds.getRepository(Tenant);
  const userRepo = ds.getRepository(User);
  const catRepo = ds.getRepository(Category);
  const prodRepo = ds.getRepository(Product);

  let tenant = await tenantRepo.findOne({ where: { slug: 'erick' } });
  if (!tenant) {
    tenant = await tenantRepo.save(tenantRepo.create({
      slug: 'erick',
      honoreeName: 'Erick',
      eventType: 'Baptism Celebration',
      brandColor: '#E91E63',
      phonePrimary: '0710209220',
      phoneSecondary: '0692506552',
      whatsappNumber: '255710209220',
      mixxBusinessNumber: '15714656',
      enabledPayments: ['mixx_by_yas', 'mpesa', 'airtel_money'],
      adminPhones: ['0710209220', '0692506552'],
      defaultLocale: 'sw',
    }));
    console.log(`✅ Tenant: ${tenant.slug} (${tenant.id})`);
  } else {
    console.log(`ℹ️  Tenant exists: ${tenant.slug}`);
  }

  const adminPhone = '255710209220';
  if (!(await userRepo.findOne({ where: { phone: adminPhone } }))) {
    await userRepo.save(userRepo.create({
      phone: adminPhone,
      name: 'Erick Admin',
      role: UserRole.ADMIN,
      isVerified: true,
      tenantId: tenant.id,
    }));
    console.log(`✅ Admin: ${adminPhone}`);
  }

  const catSeed = [
    { slug: 'wanaume', titleSw: 'Kwa Wanaume', titleEn: 'For Men', icon: '👔', sortOrder: 1 },
    { slug: 'wanawake', titleSw: 'Kwa Wanawake', titleEn: 'For Women', icon: '👗', sortOrder: 2 },
    { slug: 'watoto', titleSw: 'Kwa Watoto', titleEn: 'For Kids', icon: '👶', sortOrder: 3 },
    { slug: 'vifaa', titleSw: 'Vifaa na Vingine', titleEn: 'Accessories', icon: '👞', sortOrder: 4 },
  ];
  const categories: Category[] = [];
  for (const c of catSeed) {
    let cat = await catRepo.findOne({ where: { tenantId: tenant.id, slug: c.slug } });
    if (!cat) {
      cat = await catRepo.save(catRepo.create({
        ...c, tenantId: tenant.id,
        descSw: `Bidhaa bora za ${c.titleSw.toLowerCase()}`,
        descEn: `Best for ${c.titleEn.toLowerCase()}`,
      }));
    }
    categories.push(cat);
  }
  console.log(`✅ Categories: ${categories.length}`);

  const prodSeed = [
    { cat: 0, sku: 'MEN-SHIRT-01', nameSw: 'Shati la Kiume la Maua', nameEn: "Men's Floral Shirt", price: 45000 },
    { cat: 0, sku: 'MEN-SHIRT-02', nameSw: 'Shati Nyeusi la Maua', nameEn: 'Black Floral Shirt', price: 48000 },
    { cat: 1, sku: 'WOM-DRESS-01', nameSw: 'Gauni la Kike la Maua', nameEn: "Women's Floral Dress", price: 65000 },
    { cat: 1, sku: 'WOM-DRESS-02', nameSw: 'Gauni Nyeusi la Maua', nameEn: 'Black Floral Dress', price: 70000 },
    { cat: 2, sku: 'KID-DRESS-01', nameSw: 'Gauni la Mtoto', nameEn: 'Kids Dress', price: 30000 },
    { cat: 3, sku: 'ACC-SHOES-01', nameSw: 'Viatu vya Kike', nameEn: "Women's Shoes", price: 55000 },
  ];
  for (const p of prodSeed) {
    if (!(await prodRepo.findOne({ where: { tenantId: tenant.id, sku: p.sku } }))) {
      await prodRepo.save(prodRepo.create({
        tenantId: tenant.id, categoryId: categories[p.cat].id,
        sku: p.sku, nameSw: p.nameSw, nameEn: p.nameEn,
        descSw: 'Bidhaa bora kwa sherehe yako ya ubatizo.',
        descEn: 'Premium product for your baptism celebration.',
        price: p.price, comparePrice: p.price + 10000,
        images: ['/placeholder/product.jpg'],
        sizes: ['S','M','L','XL'], colors: ['Black','Pink','White'],
        stock: 50, isFeatured: true,
      }));
    }
  }
  console.log(`✅ Products seeded`);
  await ds.destroy();
  console.log('');
  console.log('🎉 DONE!');
}

run().catch((e) => { console.error('❌ FAILED:', e); process.exit(1); });
