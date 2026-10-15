import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation, InvitationStatus } from './entities/invitation.entity';
import { SmsService } from '../sms/sms.service';
import { AuditService } from '../audit/audit.service';
import { AuditAction } from '../audit/entities/audit-log.entity';
import { I18nService } from '../../common/i18n/i18n.service';
import { normalizeTzPhone } from '../../common/utils/phone.util';
import { shortId } from '../../common/utils/reference.util';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation) private repo: Repository<Invitation>,
    private sms: SmsService,
    private audit: AuditService,
    private i18n: I18nService,
  ) {}

  async create(
    dto: { tenantId: string; guestName: string; guestPhone: string; guestEmail?: string; guestCount?: number; notes?: string },
    lang: 'sw' | 'en' = 'sw',
    actor?: { id?: string; name?: string; role?: string; phone?: string },
  ) {
    const phone = normalizeTzPhone(dto.guestPhone)!;
    const existing = await this.repo.findOne({ where: { tenantId: dto.tenantId, guestPhone: phone } });
    if (existing) throw new ConflictException(this.i18n.t('invitation.duplicate', lang));

    const saved = await this.repo.save(this.repo.create({
      ...dto, guestPhone: phone, inviteCode: `INV-${shortId().toUpperCase()}`,
    }));

    await this.audit.log(AuditAction.INVITE_CREATE, {
      tenantId: dto.tenantId,
      actorId: actor?.id,
      actorName: actor?.name || 'Admin',
      actorRole: actor?.role || 'admin',
      targetType: 'invitation',
      targetId: saved.id,
      targetName: saved.guestName,
      description: `Created invitation for ${saved.guestName} (${saved.guestPhone}) — code ${saved.inviteCode}`,
      metadata: { inviteCode: saved.inviteCode, guestCount: saved.guestCount },
    });

    // SMS with invite code
    try {
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      await this.sms.send(
        phone,
        `Habari ${dto.guestName}!

Umealikwa kwenye sherehe ya Mama Dani (08 Novemba 2026).

Namba yako ya mwaliko: ${saved.inviteCode}

Ingia: ${baseUrl}/ingia

Tumia namba yako ya simu + namba hii ya mwaliko.`
      );
    } catch {}

    return saved;
  }

  async findByCode(code: string, lang: 'sw' | 'en' = 'sw') {
    const inv = await this.repo.findOne({ where: { inviteCode: code } });
    if (!inv) throw new NotFoundException(this.i18n.t('invitation.notFound', lang));
    return inv;
  }

  listByTenant(tenantId: string) {
    return this.repo.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
  }

  async confirm(code: string, lang: 'sw' | 'en' = 'sw') {
    const inv = await this.findByCode(code, lang);
    inv.status = InvitationStatus.CONFIRMED;
    inv.confirmedAt = new Date();
    await this.repo.save(inv);

    await this.audit.log(AuditAction.INVITE_CONFIRM, {
      tenantId: inv.tenantId,
      actorId: inv.id,
      actorName: inv.guestName,
      actorRole: 'guest',
      actorPhone: inv.guestPhone,
      targetType: 'invitation',
      targetId: inv.id,
      targetName: inv.guestName,
      description: `Guest ${inv.guestName} confirmed attendance`,
    });

    return inv;
  }

  async decline(code: string, lang: 'sw' | 'en' = 'sw') {
    const inv = await this.findByCode(code, lang);
    inv.status = InvitationStatus.DECLINED;
    inv.declinedAt = new Date();
    await this.repo.save(inv);

    await this.audit.log(AuditAction.INVITE_DECLINE, {
      tenantId: inv.tenantId,
      actorId: inv.id,
      actorName: inv.guestName,
      actorRole: 'guest',
      actorPhone: inv.guestPhone,
      targetType: 'invitation',
      targetId: inv.id,
      targetName: inv.guestName,
      description: `Guest ${inv.guestName} declined attendance`,
    });

    return inv;
  }

  async getStats(tenantId: string) {
    const [invited, confirmed, declined] = await Promise.all([
      this.repo.count({ where: { tenantId } }),
      this.repo.count({ where: { tenantId, status: InvitationStatus.CONFIRMED } }),
      this.repo.count({ where: { tenantId, status: InvitationStatus.DECLINED } }),
    ]);
    return { invitedCount: invited, confirmedCount: confirmed, declinedCount: declined };
  }

  async remove(id: string, lang: 'sw' | 'en' = 'sw') {
    const inv = await this.repo.findOne({ where: { id } });
    if (!inv) throw new NotFoundException(this.i18n.t('invitation.notFound', lang));
    await this.repo.remove(inv);

    await this.audit.log(AuditAction.INVITE_DELETE, {
      tenantId: inv.tenantId,
      actorName: 'Admin',
      actorRole: 'admin',
      targetType: 'invitation',
      targetId: inv.id,
      targetName: inv.guestName,
      description: `Deleted invitation for ${inv.guestName}`,
    });

    return { ok: true };
  }
}
