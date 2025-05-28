import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole, UserStatus } from '../users/user.schema';
import { RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      
      if (!user) {
        return null;
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (isPasswordValid) {
        const { password, ...result } = user.toObject();
        return result;
      }
      return null;
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user._id,
      role: user.role
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    };
  }

  async register(userData: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    try {
      // Create the user with hashed password
      const newUser = await this.usersService.createUser({
        ...userData,
        password: hashedPassword,
        role: UserRole.USER,
        status: UserStatus.PENDING_VERIFICATION
      });

      // Return user data without password
      const { password, ...result } = newUser.toObject();
      
      // Generate JWT token
      const payload = { 
        email: result.email, 
        sub: result._id,
        role: result.role
      };
      
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: result._id,
          email: result.email,
          firstName: result.firstName,
          lastName: result.lastName,
          role: result.role
        }
      };
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }
}
