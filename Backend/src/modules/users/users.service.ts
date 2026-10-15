import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { I18nService } from '../../common/i18n/i18n.service';
import { normalizeTzPhone } from '../../common/utils/phone.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private i18n: I18nService,
  ) {}

  async findById(id: string, lang: 'sw' | 'en' = 'sw') {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException(this.i18n.t('user.notFound', lang));
    return u;
  }

  async findByPhone(phone: string) {
    const n = normalizeTzPhone(phone);
    if (!n) return null;
    return this.repo.findOne({ where: { phone: n } });
  }

  async createUser(phone: string, name?: string, tenantId?: string) {
    const normalized = normalizeTzPhone(phone)!;
    return this.repo.save(this.repo.create({ phone: normalized, name, tenantId }));
  }

  async updateOtp(userId: string, otpHash: string, expiresAt: Date) {
    await this.repo.update(userId, { otpHash, otpExpiresAt: expiresAt });
  }

  async getOtpData(userId: string) {
    return this.repo
      .createQueryBuilder('u')
      .addSelect(['u.otpHash', 'u.otpExpiresAt'])
      .where('u.id = :userId', { userId })
      .getOne();
  }

  async markVerified(userId: string) {
    await this.repo.update(userId, { isVerified: true });
  }
}
