import { Test, TestingModule } from '@nestjs/testing';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('TenantController', () => {
  let controller: TenantController;
  let service: TenantService;

  const mockTenantService = {
    getTenantBydId: jest.fn(),
    createTenant: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantController],
      providers: [
        {
          provide: TenantService,
          useValue: mockTenantService,
        },
      ],
    }).compile();

    controller = module.get<TenantController>(TenantController);
    service = module.get<TenantService>(TenantService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTenants', () => {
    it('should return a tenant when found', async () => {
      const mockTenant = {
        tenant_id: 'technxt',
        tenant_name: 'Test Tenant',
      };
      mockTenantService.getTenantBydId.mockResolvedValue(mockTenant);

      const result = await controller.getTenants();
      expect(result).toEqual(mockTenant);
      expect(mockTenantService.getTenantBydId).toHaveBeenCalledWith('technxt');
    });

    it('should throw HttpException when tenant not found', async () => {
      mockTenantService.getTenantBydId.mockRejectedValue(new Error('Tenant not found'));

      await expect(controller.getTenants()).rejects.toThrow(HttpException);
    });
  });

  describe('createTenant', () => {
    it('should create a new tenant successfully', async () => {
      const tenantData = {
        tenant_id: 'newtenant',
        tenant_name: 'New Tenant',
      };
      const mockCreatedTenant = { ...tenantData, _id: 'some-id' };
      mockTenantService.createTenant.mockResolvedValue(mockCreatedTenant);

      const result = await controller.createTenant(tenantData);
      expect(result).toEqual(mockCreatedTenant);
      expect(mockTenantService.createTenant).toHaveBeenCalledWith(tenantData);
    });

    it('should throw HttpException when creation fails', async () => {
      const tenantData = {
        tenant_id: 'newtenant',
        tenant_name: 'New Tenant',
      };
      mockTenantService.createTenant.mockRejectedValue(new Error('Creation failed'));

      await expect(controller.createTenant(tenantData)).rejects.toThrow(HttpException);
    });
  });
}); 