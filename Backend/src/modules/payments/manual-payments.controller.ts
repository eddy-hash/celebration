import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ManualPaymentsService } from './manual-payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Lang } from '../../common/decorators/lang.decorator';

@ApiTags('payments')
@Controller('payments/manual')
export class ManualPaymentsController {
  constructor(private readonly service: ManualPaymentsService) {}

  @Post('initiate')
  initiate(
    @Body() dto: { orderId: string; customerPhone: string; customerName?: string },
    @Lang() lang: 'sw' | 'en',
  ) {
    return this.service.initiate(dto, lang);
  }

  @Post(':id/confirm')
  confirm(@Param('id') id: string, @Lang() lang: 'sw' | 'en') {
    return this.service.customerConfirm(id, lang);
  }

  @Get(':id/status')
  status(@Param('id') id: string, @Lang() lang: 'sw' | 'en') {
    return this.service.getStatus(id, lang);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('pending')
  pending(@Query('tenantId') tenantId: string) {
    return this.service.listPending(tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':id/verify')
  verify(
    @Param('id') id: string,
    @Body() dto: { mixxTransactionId: string },
    @CurrentUser('id') adminId: string,
    @Lang() lang: 'sw' | 'en',
  ) {
    return this.service.adminVerify(id, adminId, dto.mixxTransactionId, lang);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':id/reject')
  reject(
    @Param('id') id: string,
    @Body() dto: { reason: string },
    @CurrentUser('id') adminId: string,
    @Lang() lang: 'sw' | 'en',
  ) {
    return this.service.adminReject(id, adminId, dto.reason, lang);
  }
}
