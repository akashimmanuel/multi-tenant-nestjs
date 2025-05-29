import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return JWT token when login is successful', async () => {
      const loginDto: LoginDto = { 
        email: 'test@example.com', 
        password: 'password123' 
      };
      
      const user = { _id: 'user-123', email: 'test@example.com' };
      const expectedResult = { access_token: 'jwt-token-123' };
      
      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue(expectedResult);
      
      const result = await controller.login(loginDto);
      
      expect(result).toEqual(expectedResult);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });

    it('should throw UnauthorizedException when login fails', async () => {
      const loginDto: LoginDto = { 
        email: 'wrong@example.com', 
        password: 'wrongpassword' 
      };
      
      mockAuthService.validateUser.mockResolvedValue(null);
      
      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'new@example.com',
        password: 'password123',
        phoneNumber: '1234567890'
      };
      
      const expectedResult = {
        _id: 'new-user-id',
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName
      };
      
      mockAuthService.register.mockResolvedValue(expectedResult);
      
      const result = await controller.register(registerDto);
      
      expect(result).toEqual(expectedResult);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw HttpException when registration fails', async () => {
      const registerDto: RegisterDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        password: 'password123'
      };
      
      mockAuthService.register.mockRejectedValue(new Error('Email already exists'));
      
      await expect(controller.register(registerDto)).rejects.toThrow();
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', () => {
      const req = { user: { _id: 'user-123', email: 'test@example.com' } };
      
      const result = controller.getProfile(req);
      
      expect(result).toEqual(req.user);
    });
  });
}); 