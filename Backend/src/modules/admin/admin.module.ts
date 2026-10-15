import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Invitation } from '../invitations/entities/invitation.entity';
import { Order } from '../orders/entities/order.entity';
import { ManualPayment } from '../payments/entities/manual-payment.entity';
import { Uniform } from '../uniforms/entities/uniform.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invitation, Order, ManualPayment, Uniform]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET') || 'dev-secret',
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
