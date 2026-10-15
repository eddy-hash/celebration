import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { ManualPayment, ManualPaymentStatus } from './entities/manual-payment.entity';
import { OrdersService } from '../orders/orders.service';
import { TenantsService } from '../tenants/tenants.service';
import { SmsService } from '../sms/sms.service';
import { I18nService } from '../../common/i18n/i18n.service';
import { generateReferenceCode } from '../../common/utils/reference.util';
import { normalizeTzPhone, formatTzPhone } from '../../common/utils/phone.util';

@Injectable()
export class ManualPaymentsService {
  private readonly logger = new Logger(ManualPaymentsService.name);

  constructor(
    @InjectRepository(ManualPayment) private repo: Repository<ManualPayment>,
    private ordersService: OrdersService,
    private tenantsService: TenantsService,
    private sms: SmsService,
    private i18n: I18nService,
  ) {}

  async initiate(dto: { orderId: string; customerPhone: string; customerName?: string }, lang: 'sw' | 'en' = 'sw') {
    const order = await this.ordersService.findById(dto.orderId, lang);
    const tenant = await this.tenantsService.findById(order.tenantId, lang);

    const normalizedPhone = normalizeTzPhone(dto.customerPhone);
    if (!normalizedPhone) throw new BadRequestException(this.i18n.t('payment.invalidPhone', lang));

    const existing = await this.repo.findOne({
      where: [
        { orderId: order.id, status: ManualPaymentStatus.PENDING },
        { orderId: order.id, status: ManualPaymentStatus.AWAITING_VERIFICATION },
      ],
    });
    if (existing) return this.formatInitResponse(existing, tenant, lang);

    const payment = this.repo.create({
      orderId: order.id,
      tenantId: order.tenantId,
      provider: 'mixx_by_yas',
      status: ManualPaymentStatus.PENDING,
      amount: order.total,
      currency: order.currency,
      customerPhone: normalizedPhone,
      customerName: dto.customerName || order.customerName,
      referenceCode: generateReferenceCode('EBC'),
      businessNumber: tenant.mixxBusinessNumber,
    });
    await this.repo.save(payment);
    return this.formatInitResponse(payment, tenant, lang);
  }

  private formatInitResponse(payment: ManualPayment, tenant: any, lang: 'sw' | 'en') {
    return {
      paymentId: payment.id,
      referenceCode: payment.referenceCode,
      businessNumber: payment.businessNumber,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      expiresInMinutes: tenant.paymentExpiryMinutes ?? 15,
      ussdSteps: [
        'Piga *150*01#',
        'Chagua 4 — Lipa Bili',
        'Chagua 3 — Ingiza Namba ya Kampuni',
        `Ingiza Namba: ${payment.businessNumber}`,
        `Ingiza Kiasi: TSh ${payment.amount.toLocaleString('en-US')}`,
        'Ingiza PIN yako kuthibitisha',
      ],
      supportPhones: {
        primary: formatTzPhone(tenant.phonePrimary),
        secondary: formatTzPhone(tenant.phoneSecondary),
        whatsapp: tenant.whatsappNumber,
      },
      message: this.i18n.t('payment.initiated', lang),
    };
  }

  async customerConfirm(paymentId: string, lang: 'sw' | 'en' = 'sw') {
    const payment = await this.findOrFail(paymentId, lang);
    if (payment.status !== ManualPaymentStatus.PENDING) {
      throw new BadRequestException(this.i18n.t('payment.alreadyConfirmed', lang));
    }
    payment.status = ManualPaymentStatus.AWAITING_VERIFICATION;
    payment.customerConfirmedAt = new Date();
    await this.repo.save(payment);

    const tenant = await this.tenantsService.findById(payment.tenantId, lang);
    const smsBody = `Malipo mapya:\nRef: ${payment.referenceCode}\nMteja: ${formatTzPhone(payment.customerPhone)}\nKiasi: TSh ${payment.amount.toLocaleString()}`;
    for (const p of tenant.adminPhones || []) {
      await this.sms.send(p, smsBody);
    }

    return {
      status: payment.status,
      referenceCode: payment.referenceCode,
      message: this.i18n.t('payment.awaitingVerification', lang),
    };
  }

  async adminVerify(paymentId: string, adminId: string, mixxTransactionId: string, lang: 'sw' | 'en' = 'sw') {
    const payment = await this.findOrFail(paymentId, lang);
    payment.status = ManualPaymentStatus.SUCCESS;
    payment.verifiedAt = new Date();
    payment.verifiedBy = adminId;
    payment.mixxTransactionId = mixxTransactionId;
    await this.repo.save(payment);
    await this.ordersService.markAsPaid(payment.orderId);

    const order = await this.ordersService.findById(payment.orderId, lang);
    await this.sms.send(
      payment.customerPhone,
      `Habari ${payment.customerName},\nMalipo yako yamethibitishwa!\nOda: ${order.orderNumber}\nKiasi: TSh ${payment.amount.toLocaleString()}\nAsante.`,
    );
    return { status: payment.status, message: this.i18n.t('payment.verified', lang) };
  }

  async adminReject(paymentId: string, adminId: string, reason: string, lang: 'sw' | 'en' = 'sw') {
    const payment = await this.findOrFail(paymentId, lang);
    payment.status = ManualPaymentStatus.FAILED;
    payment.verifiedBy = adminId;
    payment.metadata = { ...(payment.metadata || {}), rejectionReason: reason };
    await this.repo.save(payment);
    await this.sms.send(
      payment.customerPhone,
      `Malipo yako hayakupokelewa.\nRef: ${payment.referenceCode}\nSababu: ${reason}\nWasiliana: 0710209220 / 0692506552`,
    );
    return { status: payment.status, message: this.i18n.t('payment.failed', lang) };
  }

  async getStatus(paymentId: string, lang: 'sw' | 'en' = 'sw') {
    const p = await this.findOrFail(paymentId, lang);
    return {
      id: p.id,
      status: p.status,
      referenceCode: p.referenceCode,
      amount: p.amount,
      currency: p.currency,
      verifiedAt: p.verifiedAt,
    };
  }

  listPending(tenantId: string) {
    return this.repo.find({
      where: [
        { tenantId, status: ManualPaymentStatus.PENDING },
        { tenantId, status: ManualPaymentStatus.AWAITING_VERIFICATION },
      ],
      order: { customerConfirmedAt: 'DESC', createdAt: 'DESC' },
    });
  }

  private async findOrFail(id: string, lang: 'sw' | 'en'): Promise<ManualPayment> {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException(this.i18n.t('payment.notFound', lang));
    return p;
  }

  @Cron('*/2 * * * *')
  async expireStale() {
    const cutoff = new Date(Date.now() - 15 * 60 * 1000);
    const r = await this.repo
      .createQueryBuilder()
      .update(ManualPayment)
      .set({ status: ManualPaymentStatus.EXPIRED })
      .where('status = :s AND createdAt < :cutoff', { s: ManualPaymentStatus.PENDING, cutoff })
      .execute();
    if (r.affected) this.logger.log(`Expired ${r.affected} stale payments`);
  }
}
