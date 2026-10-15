import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { I18nService } from '../../common/i18n/i18n.service';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant) private repo: Repository<Tenant>,
    private i18n: I18nService,
  ) {}

  async create(dto: Partial<Tenant>, lang: 'sw' | 'en' = 'sw') {
    const exists = await this.repo.findOne({ where: { slug: dto.slug } });
    if (exists) throw new ConflictException(this.i18n.t('tenant.slugExists', lang));
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findBySlug(slug: string, lang: 'sw' | 'en' = 'sw') {
    const t = await this.repo.findOne({ where: { slug, isActive: true } });
    if (!t) throw new NotFoundException(this.i18n.t('tenant.notFound', lang));
    return t;
  }

  async findById(id: string, lang: 'sw' | 'en' = 'sw') {
    const t = await this.repo.findOne({ where: { id } });
    if (!t) throw new NotFoundException(this.i18n.t('tenant.notFound', lang));
    return t;
  }

  async getPublicConfig(slug: string, lang: 'sw' | 'en' = 'sw') {
    const t = await this.findBySlug(slug, lang);
    return {
      slug: t.slug,
      honoreeName: t.honoreeName,
      eventType: t.eventType,
      brandColor: t.brandColor,
      logoUrl: t.logoUrl,
      heroImageUrl: t.heroImageUrl,
      phonePrimary: t.phonePrimary,
      phoneSecondary: t.phoneSecondary,
      whatsappNumber: t.whatsappNumber,
      mixxBusinessNumber: t.mixxBusinessNumber,
      enabledPayments: t.enabledPayments,
      defaultLocale: t.defaultLocale,
    };
  }
}
