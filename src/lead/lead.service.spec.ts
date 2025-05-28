import { Test, TestingModule } from '@nestjs/testing';
import { LeadService } from './lead.service';
import { PROVIDER } from '../constants/providers';
import { Model } from 'mongoose';
import { Lead } from './lead.schema';
import { Tenant } from '../tenant/tenant.schema';

describe('LeadService', () => {
  let service: LeadService;
  let leadModel: Model<Lead>;
  let tenantModel: Model<Tenant>;

  const mockLeadModel = {
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  const mockTenantModel = {
    find: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadService,
        {
          provide: PROVIDER.LEAD_MODEL,
          useValue: mockLeadModel,
        },
        {
          provide: PROVIDER.TENANT_MODEL,
          useValue: mockTenantModel,
        },
      ],
    }).compile();

    service = module.get<LeadService>(LeadService);
    leadModel = module.get<Model<Lead>>(PROVIDER.LEAD_MODEL);
    tenantModel = module.get<Model<Tenant>>(PROVIDER.TENANT_MODEL);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
