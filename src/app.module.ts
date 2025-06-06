import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseModuleAsyncOptions } from './config/mongo.config';
import { ProductModule } from './product/product.module';
import { TenantModule } from './tenant/tenant.module';
import { LeadModule } from './lead/lead.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
    ProductModule,
    TenantModule,
    LeadModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
