import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PROVIDER } from '../constants/providers';
import { User, UserRole, UserStatus } from './user.schema';
import { Tenant } from '../tenant/tenant.schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject(PROVIDER.USER_MODEL) private userModel: Model<User>,
    @Inject(PROVIDER.TENANT_MODEL) private tenantModel: Model<Tenant>,
  ) {}

  async getUsers() {
    return await this.userModel.find().exec();
  }

  async getUserById(id: string) {
    return await this.userModel.findById(id).exec();
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  async createUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: UserRole;
    status?: UserStatus;
    phoneNumber?: string;
  }): Promise<User> {
    return await this.userModel.create(userData);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
  }

  async deleteUser(id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(id).exec();
  }
}
