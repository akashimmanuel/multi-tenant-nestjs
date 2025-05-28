import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TenantsMiddleware } from 'src/middlewares/tenants.middleware';
import { TenantModels } from 'src/providers/tenant-models.provider';

@Module({
  providers: [UsersService, TenantModels.userModel, TenantModels.tenantModel],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(UsersController);
  }
}
