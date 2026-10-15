import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManualPayment } from './entities/manual-payment.entity';
import { ManualPaymentsService } from './manual-payments.service';
import { ManualPaymentsController } from './manual-payments.controller';
import { OrdersModule } from '../orders/orders.module';
import { TenantsModule } from '../tenants/tenants.module';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [TypeOrmModule.forFeature([ManualPayment]), OrdersModule, TenantsModule, SmsModule],
  providers: [ManualPaymentsService],
  controllers: [ManualPaymentsController],
  exports: [ManualPaymentsService],
})
export class PaymentsModule {}
