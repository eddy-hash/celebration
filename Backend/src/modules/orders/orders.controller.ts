import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService, CreateOrderDto } from './orders.service';
import { OrderStatus } from './entities/order.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { Lang } from '../../common/decorators/lang.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto, @Lang() lang: 'sw' | 'en') {
    return this.service.create(dto, lang);
  }

  @Get('number/:orderNumber')
  byNumber(@Param('orderNumber') n: string, @Lang() lang: 'sw' | 'en') {
    return this.service.findByNumber(n, lang);
  }

  @Get(':id')
  getOne(@Param('id') id: string, @Lang() lang: 'sw' | 'en') {
    return this.service.findById(id, lang);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  list(@Query('tenantId') tenantId: string, @Query('status') status?: OrderStatus) {
    return this.service.listByTenant(tenantId, status);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/fulfill')
  fulfill(@Param('id') id: string, @Lang() lang: 'sw' | 'en') {
    return this.service.markAsFulfilled(id, lang);
  }
}
