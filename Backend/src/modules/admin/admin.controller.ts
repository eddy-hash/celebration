import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Request } from 'express';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { Lang } from '../../common/decorators/lang.decorator';

class AdminLoginDto {
  @IsString() password: string;
}

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Post('login')
  login(
    @Body() dto: AdminLoginDto,
    @Lang() lang: 'sw' | 'en',
    @Req() req: Request,
  ) {
    return this.service.login(
      dto.password,
      lang,
      req.ip || req.socket.remoteAddress,
      req.headers['user-agent'],
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('analytics')
  analytics(@Query('tenantId') tenantId: string) {
    return this.service.getAnalytics(tenantId);
  }
}
