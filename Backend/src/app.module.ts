import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { I18nModule } from './common/i18n/i18n.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { InvitationsModule } from './modules/invitations/invitations.module';
import { UniformsModule } from './modules/uniforms/uniforms.module';
import { SmsModule } from './modules/sms/sms.module';
import { UploadModule } from './modules/upload/upload.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST') || 'localhost',
        port: Number(config.get('DB_PORT') || 5432),
        username: config.get('DB_USERNAME') || 'postgres',
        password: config.get('DB_PASSWORD') || '1234',
        database: config.get('DB_DATABASE') || 'erick_baptism',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: ['error'],
      }),
    }),

    ScheduleModule.forRoot(),
    I18nModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    InvitationsModule,
    UniformsModule,
    SmsModule,
    UploadModule,
    AdminModule,
    AuditModule,
  ],
})
export class AppModule {}
