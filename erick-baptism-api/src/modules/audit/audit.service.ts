import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { AuditAction, AuditLog } from './entities/audit-log.entity';

export interface AuditContext {
  tenantId?: string;
  actorId?: string;
  actorName?: string;
  actorRole?: string;
  actorPhone?: string;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  description?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog) private repo: Repository<AuditLog>,
  ) {}

  /** Record an audit event — never throws, always logs */
  async log(action: AuditAction, ctx: AuditContext): Promise<void> {
    try {
      await this.repo.save(this.repo.create({
        action,
        tenantId: ctx.tenantId,
        actorId: ctx.actorId,
        actorName: ctx.actorName,
        actorRole: ctx.actorRole,
        actorPhone: ctx.actorPhone,
        targetType: ctx.targetType,
        targetId: ctx.targetId,
        targetName: ctx.targetName,
        description: ctx.description,
        metadata: ctx.metadata,
        ipAddress: ctx.ipAddress,
        userAgent: ctx.userAgent,
      }));
    } catch (e) {
      this.logger.error(`Audit log failed: ${e.message}`);
    }
  }

  /** Query logs with filters and pagination */
  async query(params: {
    tenantId?: string;
    action?: AuditAction;
    actorId?: string;
    targetType?: string;
    from?: Date;
    to?: Date;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(200, params.limit || 50);

    const qb = this.repo.createQueryBuilder('log');

    if (params.tenantId) qb.andWhere('log.tenantId = :t', { t: params.tenantId });
    if (params.action) qb.andWhere('log.action = :a', { a: params.action });
    if (params.actorId) qb.andWhere('log.actorId = :aid', { aid: params.actorId });
    if (params.targetType) qb.andWhere('log.targetType = :tt', { tt: params.targetType });
    if (params.from) qb.andWhere('log.createdAt >= :from', { from: params.from });
    if (params.to) qb.andWhere('log.createdAt <= :to', { to: params.to });
    if (params.search) {
      qb.andWhere(
        '(log.actorName LIKE :s OR log.targetName LIKE :s OR log.description LIKE :s OR log.actorPhone LIKE :s)',
        { s: `%${params.search}%` },
      );
    }

    qb.orderBy('log.createdAt', 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  /** Summary stats for admin dashboard */
  async getStats(tenantId: string) {
    const total = await this.repo.count({ where: { tenantId } });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await this.repo.count({
      where: { tenantId, createdAt: Between(today, new Date()) },
    });

    const byAction = await this.repo
      .createQueryBuilder('log')
      .select('log.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .where('log.tenantId = :tenantId', { tenantId })
      .groupBy('log.action')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return { total, todayCount, byAction };
  }
}
