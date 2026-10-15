import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UniformsService } from './uniforms.service';
import { Uniform, UniformStatus } from './entities/uniform.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { Lang } from '../../common/decorators/lang.decorator';

@ApiTags('uniforms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('uniforms')
export class UniformsController {
  constructor(private readonly service: UniformsService) {}

  @Post()
  create(@Body() dto: Partial<Uniform>) {
    return this.service.create(dto);
  }

  @Get('tenant/:tenantId')
  list(@Param('tenantId') tenantId: string, @Query('status') status?: UniformStatus) {
    return this.service.listByTenant(tenantId, status);
  }

  @Get('tenant/:tenantId/stats')
  stats(@Param('tenantId') tenantId: string) {
    return this.service.getStats(tenantId);
  }

  @Get(':id')
  getOne(@Param('id') id: string, @Lang() lang: 'sw' | 'en') {
    return this.service.findById(id, lang);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<Uniform>, @Lang() lang: 'sw' | 'en') {
    return this.service.update(id, dto, lang);
  }
}
