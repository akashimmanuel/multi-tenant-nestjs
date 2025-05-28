import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    _id: 'some-id',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    userId: 'john123',
    password: 'hashedPassword',
    toObject: () => ({
      _id: 'some-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      userId: 'john123',
      password: 'hashedPassword',
    }),
  };

  const mockUserService = {
    findByUserId: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object without password if validation is successful', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      mockUserService.findByUserId.mockResolvedValue(mockUser);

      const result = await service.validateUser('john123', 'correctPassword');
      const { password, ...expectedUser } = mockUser.toObject();

      expect(result).toEqual(expectedUser);
    });

    it('should return null if user is not found', async () => {
      mockUserService.findByUserId.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent', 'anyPassword');
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));
      mockUserService.findByUserId.mockResolvedValue(mockUser);

      const result = await service.validateUser('john123', 'wrongPassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    const loginDto = {
      userId: 'john123',
      password: 'correctPassword',
    };

    it('should return access token and user data if login is successful', async () => {
      const validatedUser = {
        _id: 'some-id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        userId: 'john123',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(validatedUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        access_token: 'jwt-token',
        user: validatedUser,
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        userId: validatedUser.userId,
        email: validatedUser.email,
      });
    });

    it('should throw UnauthorizedException if login fails', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
}); 