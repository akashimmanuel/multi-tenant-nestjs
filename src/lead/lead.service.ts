import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { Model } from 'mongoose';
import { PROVIDER } from '../constants/providers';
import { Lead } from './lead.schema';
import { Tenant } from '../tenant/tenant.schema';
import { LeadFilterDto } from './dto/lead-filter.dto';

@Injectable()
export class LeadService {
  constructor(
    @Inject(PROVIDER.LEAD_MODEL) private leadModel: Model<Lead>,
    @Inject(PROVIDER.TENANT_MODEL) private tenantModel: Model<Tenant>,
  ) {}

  async getLeads(filters?: LeadFilterDto) {
    const query: any = {};

    if (filters) {
      // Search in multiple fields
      if (filters.search) {
        query.$or = [
          { firstName: { $regex: filters.search, $options: 'i' } },
          { lastName: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } },
          { mobileNo: { $regex: filters.search, $options: 'i' } },
        ];
      }

      // Exact match filters
      if (filters.leadStatus) query.leadStatus = filters.leadStatus;
      if (filters.leadType) query.leadType = filters.leadType;
      if (filters.leadProgress) query.leadProgress = filters.leadProgress;
      if (filters.province) query.province = filters.province;
      if (filters.city) query.city = filters.city;

      // Date range filter
      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
        if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
      }
    }
    
    return await this.leadModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async getLeadById(id: string): Promise<Lead> {
    return await this.leadModel.findById(id).exec();
  }

  async checkDuplicateLead(email: string, mobileNo: string): Promise<boolean> {
    const existingLead = await this.leadModel.findOne({
      $or: [
        { email: email.toLowerCase() },
        { mobileNo }
      ]
    }).exec();
    return !!existingLead;
  }

  async createLead(leadData: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNo: string;
    landlineNo?: string;
    province: string;
    city: string;
    leadType: string;
    leadStatus: string;
    leadProgress: string;
    allocatorRemarks?: string;
    userRemarks?: string;
    appointmentDate?: Date;
  }): Promise<Lead> {
    // Check for duplicate lead
    const isDuplicate = await this.checkDuplicateLead(leadData.email, leadData.mobileNo);
    if (isDuplicate) {
      throw new ConflictException('A lead with this email or mobile number already exists');
    }

    // If no duplicate, create the lead
    return await this.leadModel.create(leadData);
  }

  async updateLead(id: string, leadData: Partial<Lead>): Promise<Lead> {
    return await this.leadModel.findByIdAndUpdate(id, leadData, { new: true }).exec();
  }

  async deleteLead(id: string): Promise<Lead> {
    return await this.leadModel.findByIdAndDelete(id).exec();
  }

  async getLeadStatusCounts(): Promise<{ [status: string]: number }> {
    const counts = await this.leadModel.aggregate([
      {
        $group: {
          _id: '$leadStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert to key-value object
    const result: { [status: string]: number } = {};
    counts.forEach((item) => {
      result[item._id] = item.count;
    });

    return result;
  }

}
