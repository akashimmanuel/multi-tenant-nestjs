import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRole, UserStatus } from './user.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  const mockUser = {
    _id: 'user-id-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'hashedpassword',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    phoneNumber: '1234567890',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [mockUser];
      mockUsersService.getUsers.mockResolvedValue(mockUsers);

      expect(await controller.getUsers()).toBe(mockUsers);
      expect(mockUsersService.getUsers).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const errorMessage = 'Database error';
      mockUsersService.getUsers.mockRejectedValue(new Error(errorMessage));

      try {
        await controller.getUsers();
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(errorMessage);
        expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      mockUsersService.getUserById.mockResolvedValue(mockUser);

      expect(await controller.getUserById(mockUser._id)).toBe(mockUser);
      expect(mockUsersService.getUserById).toHaveBeenCalledWith(mockUser._id);
    });

    it('should handle errors', async () => {
      const errorMessage = 'User not found';
      mockUsersService.getUserById.mockRejectedValue(new Error(errorMessage));

      try {
        await controller.getUserById('nonexistent-id');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(errorMessage);
        expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'password123',
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        phoneNumber: '0987654321',
      };
      
      mockUsersService.createUser.mockResolvedValue({ _id: 'new-user-id', ...userData });

      const result = await controller.createUser(userData);
      
      expect(result).toEqual({ _id: 'new-user-id', ...userData });
      expect(mockUsersService.createUser).toHaveBeenCalledWith(userData);
    });

    it('should handle errors during user creation', async () => {
      const userData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'existing@example.com',
        password: 'password123',
      };
      
      const errorMessage = 'Email already exists';
      mockUsersService.createUser.mockRejectedValue(new Error(errorMessage));

      try {
        await controller.createUser(userData);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(errorMessage);
        expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = 'user-id-123';
      const updateData = {
        firstName: 'John',
        lastName: 'Updated',
        status: UserStatus.INACTIVE,
      };
      
      const updatedUser = { ...mockUser, ...updateData };
      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.updateUser(userId, updateData);
      
      expect(result).toEqual(updatedUser);
      expect(mockUsersService.updateUser).toHaveBeenCalledWith(userId, updateData);
    });

    it('should handle errors during user update', async () => {
      const userId = 'nonexistent-id';
      const updateData = { firstName: 'New Name' };
      
      const errorMessage = 'User not found';
      mockUsersService.updateUser.mockRejectedValue(new Error(errorMessage));

      try {
        await controller.updateUser(userId, updateData);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(errorMessage);
        expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userId = 'user-id-to-delete';
      mockUsersService.deleteUser.mockResolvedValue({ _id: userId, deleted: true });

      const result = await controller.deleteUser(userId);
      
      expect(result).toEqual({ _id: userId, deleted: true });
      expect(mockUsersService.deleteUser).toHaveBeenCalledWith(userId);
    });

    it('should handle errors during user deletion', async () => {
      const userId = 'nonexistent-id';
      const errorMessage = 'User not found';
      mockUsersService.deleteUser.mockRejectedValue(new Error(errorMessage));

      try {
        await controller.deleteUser(userId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(errorMessage);
        expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
