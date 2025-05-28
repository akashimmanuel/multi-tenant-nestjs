import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    getProducts: jest.fn(),
    createProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const mockProducts = [
        {
          name: 'Product 1',
          description: 'Description 1',
          price: 100,
          sku: 'SKU1',
        },
        {
          name: 'Product 2',
          description: 'Description 2',
          price: 200,
          sku: 'SKU2',
        },
      ];
      mockProductService.getProducts.mockResolvedValue(mockProducts);

      const result = await controller.getProducts();
      expect(result).toEqual(mockProducts);
      expect(mockProductService.getProducts).toHaveBeenCalled();
    });

    it('should throw HttpException when products fetch fails', async () => {
      mockProductService.getProducts.mockRejectedValue(new Error('Failed to fetch products'));

      await expect(controller.getProducts()).rejects.toThrow(HttpException);
    });
  });

  describe('createProduct', () => {
    it('should create a new product successfully', async () => {
      const productData = {
        name: 'New Product',
        description: 'New Description',
        price: 150,
        sku: 'NEW-SKU',
      };
      const mockCreatedProduct = { ...productData, _id: 'some-id' };
      mockProductService.createProduct.mockResolvedValue(mockCreatedProduct);

      const result = await controller.createProduct(productData);
      expect(result).toEqual(mockCreatedProduct);
      expect(mockProductService.createProduct).toHaveBeenCalledWith(productData);
    });

    it('should throw HttpException when product creation fails', async () => {
      const productData = {
        name: 'New Product',
        description: 'New Description',
        price: 150,
        sku: 'NEW-SKU',
      };
      mockProductService.createProduct.mockRejectedValue(new Error('Creation failed'));

      await expect(controller.createProduct(productData)).rejects.toThrow(HttpException);
    });
  });
}); 