import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { I18nService } from '../../common/i18n/i18n.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private repo: Repository<Category>,
    private i18n: I18nService,
  ) {}

  create(dto: Partial<Category>) {
    return this.repo.save(this.repo.create(dto));
  }

  findByTenant(tenantId: string) {
    return this.repo.find({
      where: { tenantId, isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async findById(id: string, lang: 'sw' | 'en' = 'sw') {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException(this.i18n.t('category.notFound', lang));
    return c;
  }
}
