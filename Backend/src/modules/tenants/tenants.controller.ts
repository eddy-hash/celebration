import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { Lang } from '../../common/decorators/lang.decorator';
import { Tenant } from './entities/tenant.entity';

@ApiTags('tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly service: TenantsService) {}

  @Get(':slug/config')
  getConfig(@Param('slug') slug: string, @Lang() lang: 'sw' | 'en') {
    return this.service.getPublicConfig(slug, lang);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  findAll() { return this.service.findAll(); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() dto: Partial<Tenant>, @Lang() lang: 'sw' | 'en') {
    return this.service.create(dto, lang);
  }
}
