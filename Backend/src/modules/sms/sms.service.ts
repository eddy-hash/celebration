import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async send(phone: string, message: string): Promise<void> {
    const normalized = phone.replace(/\D/g, '');
    this.logger.log(`📱 SMS → ${normalized}\n${message}`);
  }
}
