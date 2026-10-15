import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Uniform, UniformStatus } from './entities/uniform.entity';
import { I18nService } from '../../common/i18n/i18n.service';

@Injectable()
export class UniformsService {
  constructor(
    @InjectRepository(Uniform) private repo: Repository<Uniform>,
    private i18n: I18nService,
  ) {}

  create(dto: Partial<Uniform>) {
    return this.repo.save(this.repo.create(dto));
  }

  listByTenant(tenantId: string, status?: UniformStatus) {
    const where: any = { tenantId };
    if (status) where.status = status;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findById(id: string, lang: 'sw' | 'en' = 'sw') {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException(this.i18n.t('uniform.notFound', lang));
    return u;
  }

  async update(id: string, dto: Partial<Uniform>, lang: 'sw' | 'en' = 'sw') {
    const u = await this.findById(id, lang);
    Object.assign(u, dto);
    if (dto.status === UniformStatus.DISTRIBUTED) u.distributedAt = new Date();
    return this.repo.save(u);
  }

  async getStats(tenantId: string) {
    const total = await this.repo.count({ where: { tenantId } });
    const delivered = await this.repo.count({ where: { tenantId, status: UniformStatus.DELIVERED } });
    const distributed = await this.repo.count({ where: { tenantId, status: UniformStatus.DISTRIBUTED } });
    const costRow = await this.repo
      .createQueryBuilder('u')
      .select('COALESCE(SUM(u.cost), 0)', 'sum')
      .where('u.tenantId = :tenantId', { tenantId })
      .getRawOne();
    return {
      total,
      delivered,
      distributed,
      withUniform: delivered + distributed,
      withoutUniform: total - (delivered + distributed),
      totalCost: Number(costRow?.sum || 0),
    };
  }
}
