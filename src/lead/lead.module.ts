import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { TenantsMiddleware } from 'src/middlewares/tenants.middleware';
import { TenantModels } from 'src/providers/tenant-models.provider';

@Module({
  providers: [LeadService, TenantModels.leadModel, TenantModels.tenantModel],
  controllers: [LeadController],
})
export class LeadModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(LeadController);
  }
} 