import { Controller, Get, HttpException, HttpStatus, Post, Body, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('tenant')
@UseGuards(JwtAuthGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  async getTenants() {
    try {
      return await this.tenantService.getTenant();
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createTenant(@Body() tenantData: { tenant_id: string; tenant_name: string }) {
    try {
      return await this.tenantService.createTenant(tenantData);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
