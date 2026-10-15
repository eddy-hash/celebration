import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation, InvitationStatus } from '../invitations/entities/invitation.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { ManualPayment, ManualPaymentStatus } from '../payments/entities/manual-payment.entity';
import { Uniform, UniformStatus } from '../uniforms/entities/uniform.entity';
import { AuditService } from '../audit/audit.service';
import { AuditAction } from '../audit/entities/audit-log.entity';
import { I18nService } from '../../common/i18n/i18n.service';

@Injectable()
export class AdminService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private i18n: I18nService,
    private audit: AuditService,
    @InjectRepository(Invitation) private invRepo: Repository<Invitation>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(ManualPayment) private payRepo: Repository<ManualPayment>,
    @InjectRepository(Uniform) private uniformRepo: Repository<Uniform>,
  ) {}

  async login(password: string, lang: 'sw' | 'en' = 'sw', ip?: string, ua?: string) {
    const expected = this.config.get('ADMIN_PASSWORD') || '2014';
    const ok = password === expected;

    await this.audit.log(
      ok ? AuditAction.ADMIN_LOGIN : AuditAction.ADMIN_LOGIN_FAILED,
      {
        actorId: 'admin-mama-dani',
        actorName: 'Mama Dani Admin',
        actorRole: 'admin',
        description: ok ? 'Admin logged in' : 'Failed login attempt',
        ipAddress: ip,
        userAgent: ua,
      },
    );

    if (!ok) {
      throw new UnauthorizedException(
        lang === 'sw' ? 'Namba ya siri si sahihi.' : 'Invalid password.',
      );
    }

    const token = this.jwt.sign({
      sub: 'admin-mama-dani',
      role: 'admin',
      name: 'Mama Dani Admin',
    });

    return {
      accessToken: token,
      user: { id: 'admin-mama-dani', role: 'admin', name: 'Mama Dani Admin' },
    };
  }

  async getAnalytics(tenantId: string) {
    const invitedCount = await this.invRepo.count({ where: { tenantId } });
    const confirmedCount = await this.invRepo.count({ where: { tenantId, status: InvitationStatus.CONFIRMED } });
    const pendingCount = await this.invRepo.count({ where: { tenantId, status: InvitationStatus.PENDING } });
    const declinedCount = await this.invRepo.count({ where: { tenantId, status: InvitationStatus.DECLINED } });

    const guestSum = await this.invRepo
      .createQueryBuilder('i')
      .select('COALESCE(SUM(i.guestCount), 0)', 'sum')
      .where('i.tenantId = :tenantId AND i.status = :s', { tenantId, s: InvitationStatus.CONFIRMED })
      .getRawOne();

    const totalOrders = await this.orderRepo.count({ where: { tenantId } });
    const paidOrders = await this.orderRepo.count({ where: { tenantId, status: OrderStatus.PAID } });
    const fulfilledOrders = await this.orderRepo.count({ where: { tenantId, status: OrderStatus.FULFILLED } });
    const awaitingPayOrders = await this.orderRepo.count({ where: { tenantId, status: OrderStatus.AWAITING_PAYMENT } });

    const revenueRow = await this.orderRepo
      .createQueryBuilder('o')
      .select('COALESCE(SUM(o.total), 0)', 'sum')
      .where('o.tenantId = :tenantId AND o.status IN (:...st)', {
        tenantId, st: [OrderStatus.PAID, OrderStatus.FULFILLED],
      })
      .getRawOne();

    const pendingPayments = await this.payRepo.count({
      where: [
        { tenantId, status: ManualPaymentStatus.PENDING },
        { tenantId, status: ManualPaymentStatus.AWAITING_VERIFICATION },
      ],
    });
    const successfulPayments = await this.payRepo.count({ where: { tenantId, status: ManualPaymentStatus.SUCCESS } });

    const totalUniforms = await this.uniformRepo.count({ where: { tenantId } });
    const deliveredCount = await this.uniformRepo.count({ where: { tenantId, status: UniformStatus.DELIVERED } });
    const distributedCount = await this.uniformRepo.count({ where: { tenantId, status: UniformStatus.DISTRIBUTED } });
    const orderedCount = await this.uniformRepo.count({ where: { tenantId, status: UniformStatus.ORDERED } });

    const uniformCostRow = await this.uniformRepo
      .createQueryBuilder('u')
      .select('COALESCE(SUM(u.cost), 0)', 'sum')
      .where('u.tenantId = :tenantId', { tenantId })
      .getRawOne();

    const recentInvites = await this.invRepo.find({
      where: { tenantId }, order: { createdAt: 'DESC' }, take: 5,
    });
    const recentPayments = await this.payRepo.find({
      where: { tenantId }, order: { createdAt: 'DESC' }, take: 5,
    });

    return {
      invitations: {
        total: invitedCount, confirmed: confirmedCount, pending: pendingCount,
        declined: declinedCount, confirmedGuests: Number(guestSum?.sum || 0),
      },
      orders: {
        total: totalOrders, paid: paidOrders, fulfilled: fulfilledOrders,
        awaitingPayment: awaitingPayOrders, revenue: Number(revenueRow?.sum || 0),
      },
      payments: { pending: pendingPayments, successful: successfulPayments },
      uniforms: {
        total: totalUniforms, ordered: orderedCount, delivered: deliveredCount,
        distributed: distributedCount,
        withUniform: deliveredCount + distributedCount,
        withoutUniform: totalUniforms - (deliveredCount + distributedCount),
        totalCost: Number(uniformCostRow?.sum || 0),
      },
      recent: {
        invites: recentInvites.map((i) => ({
          id: i.id, guestName: i.guestName, guestPhone: i.guestPhone,
          status: i.status, inviteCode: i.inviteCode, createdAt: i.createdAt,
        })),
        payments: recentPayments.map((p) => ({
          id: p.id, referenceCode: p.referenceCode, amount: p.amount,
          status: p.status, customerName: p.customerName, createdAt: p.createdAt,
        })),
      },
    };
  }
}
