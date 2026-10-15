import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem, OrderStatus } from './entities/order.entity';
import { ProductsService } from '../products/products.service';
import { I18nService } from '../../common/i18n/i18n.service';
import { generateOrderNumber } from '../../common/utils/reference.util';
import { normalizeTzPhone } from '../../common/utils/phone.util';

export interface CreateOrderDto {
  tenantId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  region?: string;
  notes?: string;
  items: { productId: string; quantity: number; size?: string; color?: string }[];
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private repo: Repository<Order>,
    @InjectRepository(OrderItem) private itemsRepo: Repository<OrderItem>,
    private productsService: ProductsService,
    private i18n: I18nService,
  ) {}

  async create(dto: CreateOrderDto, lang: 'sw' | 'en' = 'sw') {
    if (!dto.items?.length) {
      throw new BadRequestException(this.i18n.t('order.emptyCart', lang));
    }

    const items: OrderItem[] = [];
    let subtotal = 0;

    for (const line of dto.items) {
      const product = await this.productsService.findById(line.productId, lang);
      const lineTotal = product.price * line.quantity;
      subtotal += lineTotal;
      items.push(
        this.itemsRepo.create({
          productId: product.id,
          productName: product.nameSw,
          imageUrl: product.images?.[0],
          size: line.size,
          color: line.color,
          unitPrice: product.price,
          quantity: line.quantity,
          lineTotal,
        }),
      );
    }

    const customerPhone = normalizeTzPhone(dto.customerPhone)!;
    const order = this.repo.create({
      orderNumber: generateOrderNumber('ORD'),
      tenantId: dto.tenantId,
      customerName: dto.customerName,
      customerPhone,
      customerEmail: dto.customerEmail,
      deliveryAddress: dto.deliveryAddress,
      region: dto.region,
      notes: dto.notes,
      subtotal,
      shipping: 0,
      discount: 0,
      total: subtotal,
      status: OrderStatus.AWAITING_PAYMENT,
      items,
    });

    return this.repo.save(order);
  }

  async findById(id: string, lang: 'sw' | 'en' = 'sw') {
    const o = await this.repo.findOne({ where: { id }, relations: ['items'] });
    if (!o) throw new NotFoundException(this.i18n.t('order.notFound', lang));
    return o;
  }

  async findByNumber(orderNumber: string, lang: 'sw' | 'en' = 'sw') {
    const o = await this.repo.findOne({ where: { orderNumber }, relations: ['items'] });
    if (!o) throw new NotFoundException(this.i18n.t('order.notFound', lang));
    return o;
  }

  listByTenant(tenantId: string, status?: OrderStatus) {
    const where: any = { tenantId };
    if (status) where.status = status;
    return this.repo.find({ where, relations: ['items'], order: { createdAt: 'DESC' } });
  }

  async markAsPaid(orderId: string) {
    const order = await this.findById(orderId);
    if (order.status === OrderStatus.PAID) return order;
    order.status = OrderStatus.PAID;
    order.paidAt = new Date();
    await this.repo.save(order);
    for (const item of order.items) {
      try { await this.productsService.decrementStock(item.productId, item.quantity); } catch {}
    }
    return order;
  }

  async markAsFulfilled(orderId: string, lang: 'sw' | 'en' = 'sw') {
    const order = await this.findById(orderId, lang);
    order.status = OrderStatus.FULFILLED;
    order.fulfilledAt = new Date();
    return this.repo.save(order);
  }
}
