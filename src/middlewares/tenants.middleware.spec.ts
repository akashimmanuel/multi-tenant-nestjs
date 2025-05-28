import { Test, TestingModule } from '@nestjs/testing';
import { TenantsMiddleware } from './tenants.middleware';
import { TenantService } from '../tenant/tenant.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';

describe('TenantsMiddleware', () => {
  let middleware: TenantsMiddleware;
  let tenantService: TenantService;

  const mockTenantService = {
    getTenantBydId: jest.fn(),
  };

  const mockRequest = {
    headers: {},
  } as Request;

  const mockResponse = {} as Response;
  const mockNext = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantsMiddleware,
        {
          provide: TenantService,
          useValue: mockTenantService,
        },
      ],
    }).compile();

    middleware = module.get<TenantsMiddleware>(TenantsMiddleware);
    tenantService = module.get<TenantService>(TenantService);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use', () => {
    it('should throw BadRequestException when x-tenant-id header is missing', async () => {
      await expect(middleware.use(mockRequest, mockResponse, mockNext)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when tenant does not exist', async () => {
      mockRequest.headers['x-tenant-id'] = 'nonexistent';
      mockTenantService.getTenantBydId.mockResolvedValue(null);

      await expect(middleware.use(mockRequest, mockResponse, mockNext)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should set tenant_id in request and call next when tenant exists', async () => {
      const tenantId = 'existing-tenant';
      mockRequest.headers['x-tenant-id'] = tenantId;
      mockTenantService.getTenantBydId.mockResolvedValue({ tenant_id: tenantId });

      await middleware.use(mockRequest, mockResponse, mockNext);

      expect(mockRequest['tenant_id']).toBe(tenantId);
      expect(mockNext).toHaveBeenCalled();
    });
  });
}); 