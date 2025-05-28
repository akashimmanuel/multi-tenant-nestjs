import { Connection } from 'mongoose';
import { PROVIDER } from 'src/constants/providers';
import { Product, ProductSchema } from 'src/product/product.schema';
import { Tenant, TenantSchema } from 'src/tenant/tenant.schema';
import { Lead, LeadSchema } from 'src/lead/lead.schema';

export const TenantModels = {
  productModel: {
    provide: PROVIDER.PRODUCT_MODEL,
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Product.name, ProductSchema);
    },
    inject: [PROVIDER.TENANT_CONNECTION],
  },

  tenantModel: {
    provide: PROVIDER.TENANT_MODEL,
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Tenant.name, TenantSchema);
    },
    inject: [PROVIDER.TENANT_CONNECTION],
  },

  leadModel: {
    provide: PROVIDER.LEAD_MODEL,
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Lead.name, LeadSchema);
    },
    inject: [PROVIDER.TENANT_CONNECTION],
  },
};
