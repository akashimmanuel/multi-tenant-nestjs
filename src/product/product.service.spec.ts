import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PROVIDER } from '../constants/providers';
import { Model } from 'mongoose';
import { Product } from './product.schema';
import { Tenant } from '../tenant/tenant.schema';

describe('ProductService', () => {
  let service: ProductService;
  let productModel: Model<Product>;
  let tenantModel: Model<Tenant>;

  const mockProductModel = {
    find: jest.fn(),
    create: jest.fn(),
  };

  const mockTenantModel = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PROVIDER.PRODUCT_MODEL,
          useValue: mockProductModel,
        },
        {
          provide: PROVIDER.TENANT_MODEL,
          useValue: mockTenantModel,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productModel = module.get<Model<Product>>(PROVIDER.PRODUCT_MODEL);
    tenantModel = module.get<Model<Tenant>>(PROVIDER.TENANT_MODEL);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const mockProducts = [
        { name: 'Product 1', description: 'Description 1', price: 100, sku: 'SKU1' },
        { name: 'Product 2', description: 'Description 2', price: 200, sku: 'SKU2' },
      ];

      const mockExec = jest.fn().mockResolvedValue(mockProducts);
      mockProductModel.find.mockReturnValue({ exec: mockExec });

      const result = await service.getProducts();
      expect(result).toEqual(mockProducts);
      expect(mockProductModel.find).toHaveBeenCalled();
    });
  });

  describe('createProduct', () => {
    it('should create a new product successfully', async () => {
      const productData = {
        name: 'New Product',
        description: 'New Description',
        price: 150,
        sku: 'SKU3',
      };

      const mockProduct = {
        ...productData,
        _id: 'some-id',
      };

      mockProductModel.create.mockResolvedValue(mockProduct);

      const result = await service.createProduct(productData);
      expect(result).toEqual(mockProduct);
      expect(mockProductModel.create).toHaveBeenCalledWith(productData);
    });
  });
}); 