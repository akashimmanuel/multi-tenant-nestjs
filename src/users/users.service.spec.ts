import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PROVIDER } from '../constants/providers';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { Tenant } from '../tenant/tenant.schema';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;
  let tenantModel: Model<Tenant>;

  const mockUserModel = {
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  const mockTenantModel = {
    find: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PROVIDER.USER_MODEL,
          useValue: mockUserModel,
        },
        {
          provide: PROVIDER.TENANT_MODEL,
          useValue: mockTenantModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(PROVIDER.USER_MODEL);
    tenantModel = module.get<Model<Tenant>>(PROVIDER.TENANT_MODEL);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
