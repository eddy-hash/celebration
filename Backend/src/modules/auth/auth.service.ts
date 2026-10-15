import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Invitation, InvitationStatus } from '../invitations/entities/invitation.entity';
import { TenantsService } from '../tenants/tenants.service';
import { AuditService } from '../audit/audit.service';
import { AuditAction } from '../audit/entities/audit-log.entity';
import { I18nService } from '../../common/i18n/i18n.service';
import { normalizeTzPhone } from '../../common/utils/phone.util';

export interface UnifiedLoginDto {
  phone: string;
  code: string;
}

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwt: JwtService,
    private tenantsService: TenantsService,
    private audit: AuditService,
    private i18n: I18nService,
    @InjectRepository(Invitation) private invRepo: Repository<Invitation>,
  ) {}

  async login(dto: UnifiedLoginDto, lang: 'sw' | 'en' = 'sw', ip?: string, ua?: string) {
    const normalizedPhone = normalizeTzPhone(dto.phone);
    if (!normalizedPhone) {
      throw new BadRequestException(
        lang === 'sw'
          ? 'Namba ya simu si sahihi. Mfano: 0710 209 220'
          : 'Invalid phone number. Example: 0710 209 220',
      );
    }

    const adminPhone = normalizeTzPhone(this.config.get('ADMIN_PHONE') || '0692506552');
    const adminPassword = this.config.get('ADMIN_PASSWORD') || '2014';
    const code = (dto.code || '').trim();

    // ============ ADMIN PATH ============
    if (normalizedPhone === adminPhone && code === adminPassword) {
      const token = this.jwt.sign({
        sub: 'admin-mama-dani',
        role: 'admin',
        name: 'Mama Dani Admin',
        phone: normalizedPhone,
      });

      await this.audit.log(AuditAction.ADMIN_LOGIN, {
        actorId: 'admin-mama-dani',
        actorName: 'Mama Dani Admin',
        actorRole: 'admin',
        actorPhone: normalizedPhone,
        description: 'Admin logged in',
        ipAddress: ip,
        userAgent: ua,
      });

      return {
        type: 'admin' as const,
        accessToken: token,
        user: {
          id: 'admin-mama-dani',
          role: 'admin' as const,
          name: 'Mama Dani Admin',
          phone: normalizedPhone,
        },
      };
    }

    // ============ GUEST PATH ============
    const invitation = await this.invRepo.findOne({
      where: { guestPhone: normalizedPhone },
    });

    // Admin phone + wrong password + no invitation → clear error
    if (normalizedPhone === adminPhone && !invitation) {
      await this.audit.log(AuditAction.ADMIN_LOGIN_FAILED, {
        actorPhone: normalizedPhone,
        actorRole: 'unknown',
        description: 'Wrong admin password, no guest invite found',
        ipAddress: ip,
        userAgent: ua,
      });

      throw new UnauthorizedException(
        lang === 'sw'
          ? 'Weka namba sahihi ya mwaliko'
          : 'Enter correct invitation code',
      );
    }

    if (!invitation) {
      throw new NotFoundException(
        lang === 'sw'
          ? 'Hakuna mwaliko kwa namba hii. Wasiliana: 0710 209 220'
          : 'No invitation found for this phone. Contact: 0710 209 220',
      );
    }

    if (invitation.status === InvitationStatus.DECLINED) {
      throw new UnauthorizedException(
        lang === 'sw' ? 'Mwaliko umekataliwa.' : 'Invitation was declined.',
      );
    }

    if (invitation.inviteCode.toUpperCase() !== code.toUpperCase()) {
      await this.audit.log(AuditAction.GUEST_LOGIN_FAILED, {
        tenantId: invitation.tenantId,
        actorPhone: normalizedPhone,
        actorName: invitation.guestName,
        actorRole: 'guest',
        targetType: 'invitation',
        targetId: invitation.id,
        description: `Wrong invite code for ${invitation.guestName}`,
        ipAddress: ip,
        userAgent: ua,
      });

      throw new UnauthorizedException(
        lang === 'sw'
          ? 'Namba ya mwaliko si sahihi'
          : 'Invalid invitation code',
      );
    }

    // ✅ Guest verified
    const tenant = await this.tenantsService.findById(invitation.tenantId, lang);

    const token = this.jwt.sign({
      sub: invitation.id,
      role: 'guest',
      tenantId: invitation.tenantId,
      inviteCode: invitation.inviteCode,
      guestName: invitation.guestName,
    });

    await this.audit.log(AuditAction.GUEST_LOGIN, {
      tenantId: invitation.tenantId,
      actorId: invitation.id,
      actorName: invitation.guestName,
      actorPhone: normalizedPhone,
      actorRole: 'guest',
      targetType: 'invitation',
      targetId: invitation.id,
      targetName: invitation.guestName,
      description: `${invitation.guestName} logged in with invite code`,
      ipAddress: ip,
      userAgent: ua,
    });

    return {
      type: 'guest' as const,
      accessToken: token,
      user: {
        id: invitation.id,
        role: 'guest' as const,
        name: invitation.guestName,
        phone: invitation.guestPhone,
        inviteCode: invitation.inviteCode,
        tenantId: invitation.tenantId,
      },
      tenant: {
        slug: tenant.slug,
        honoreeName: tenant.honoreeName,
        brandColor: tenant.brandColor,
        whatsappNumber: tenant.whatsappNumber,
        phonePrimary: tenant.phonePrimary,
        phoneSecondary: tenant.phoneSecondary,
      },
    };
  }
}
