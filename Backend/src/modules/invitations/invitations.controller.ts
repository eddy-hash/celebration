import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InvitationsService } from './invitations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { Lang } from '../../common/decorators/lang.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('invitations')
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly service: InvitationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  create(
    @Body() dto: any,
    @Lang() lang: 'sw' | 'en',
    @CurrentUser() actor: any,
  ) {
    return this.service.create(dto, lang, actor);
  }

  @Get('tenant/:tenantId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  list(@Param('tenantId') tenantId: string) {
    return this.service.listByTenant(tenantId);
  }

  @Get('tenant/:tenantId/stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  stats(@Param('tenantId') tenantId: string) {
    return this.service.getStats(tenantId);
  }

  @Get(':code')
  byCode(@Param('code') code: string, @Lang() lang: 'sw' | 'en') {
    return this.service.findByCode(code, lang);
  }

  @Post(':code/confirm')
  confirm(@Param('code') code: string, @Lang() lang: 'sw' | 'en') {
    return this.service.confirm(code, lang);
  }

  @Post(':code/decline')
  decline(@Param('code') code: string, @Lang() lang: 'sw' | 'en') {
    return this.service.decline(code, lang);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Lang() lang: 'sw' | 'en') {
    return this.service.remove(id, lang);
  }
}
