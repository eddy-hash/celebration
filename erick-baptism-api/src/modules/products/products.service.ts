import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './entities/product.entity';
import { I18nService } from '../../common/i18n/i18n.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    private i18n: I18nService,
  ) {}

  create(dto: Partial<Product>) {
    return this.repo.save(this.repo.create(dto));
  }

  async findAll(q: { tenantId?: string; categoryId?: string; page?: number; limit?: number }) {
    const page = Math.max(1, q.page || 1);
    const limit = Math.min(100, q.limit || 20);
    const where: any = { isActive: true };
    if (q.tenantId) where.tenantId = q.tenantId;
    if (q.categoryId) where.categoryId = q.categoryId;

    const [items, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  search(tenantId: string, term: string) {
    return this.repo.find({
      where: [
        { tenantId, nameSw: ILike(`%${term}%`), isActive: true },
        { tenantId, nameEn: ILike(`%${term}%`), isActive: true },
        { tenantId, sku: ILike(`%${term}%`), isActive: true },
      ],
      take: 30,
    });
  }

  async findById(id: string, lang: 'sw' | 'en' = 'sw') {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException(this.i18n.t('product.notFound', lang));
    return p;
  }

  async decrementStock(productId: string, qty: number, lang: 'sw' | 'en' = 'sw') {
    const p = await this.findById(productId, lang);
    if (p.stock < qty) {
      throw new BadRequestException(
        this.i18n.t('product.insufficientStock', lang, { count: p.stock }),
      );
    }
    p.stock -= qty;
    return this.repo.save(p);
  }
}
