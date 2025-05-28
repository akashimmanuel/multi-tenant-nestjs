import { Test, TestingModule } from '@nestjs/testing';
import { TenantService } from './tenant.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from './tenant.schema';

describe('TenantService', () => {
  let service: TenantService;
  let tenantModel: Model<Tenant>;

  const mockTenantModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        {
          provide: getModelToken(Tenant.name),
          useValue: mockTenantModel,
        },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);
    tenantModel = module.get<Model<Tenant>>(getModelToken(Tenant.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTenantBydId', () => {
    it('should return a tenant when found', async () => {
      const mockTenant = {
        tenant_id: 'test-tenant',
        tenant_name: 'Test Tenant',
      };

      const mockExec = jest.fn().mockResolvedValue(mockTenant);
      mockTenantModel.findOne.mockReturnValue({ exec: mockExec });

      const result = await service.getTenantById('test-tenant');
      expect(result).toEqual(mockTenant);
      expect(mockTenantModel.findOne).toHaveBeenCalledWith({ tenant_id: 'test-tenant' });
    });

    it('should return null when tenant not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      mockTenantModel.findOne.mockReturnValue({ exec: mockExec });

      const result = await service.getTenantById('nonexistent');
      expect(result).toBeNull();
      expect(mockTenantModel.findOne).toHaveBeenCalledWith({ tenant_id: 'nonexistent' });
    });
  });

  describe('createTenant', () => {
    it('should create a new tenant successfully', async () => {
      const tenantData = {
        tenant_id: 'new-tenant',
        tenant_name: 'New Tenant',
      };

      const mockTenant = {
        ...tenantData,
        _id: 'some-id',
      };

      mockTenantModel.create.mockResolvedValue(mockTenant);

      const result = await service.createTenant(tenantData);
      expect(result).toEqual(mockTenant);
      expect(mockTenantModel.create).toHaveBeenCalledWith(tenantData);
    });
  });
}); 