import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tenant } from './tenant.schema';
import { Model } from 'mongoose';

@Injectable()
export class TenantService {
  constructor(@InjectModel(Tenant.name) private TenantModel: Model<Tenant>) {}

  async getTenant(): Promise<Tenant[]> {
    return await this.TenantModel.find({}).exec();
  }

  async getTenantById(tenant_id: string): Promise<Tenant> {
    return await this.TenantModel.findOne({ tenant_id }).exec();
  }

  async createTenant(tenantData: { tenant_id: string; tenant_name: string }): Promise<Tenant> {
    return await this.TenantModel.create(tenantData);
  }
}
