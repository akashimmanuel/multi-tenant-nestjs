import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { LeadService } from './lead.service';
import { Lead } from './lead.schema';
import { LeadFilterDto } from './dto/lead-filter.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('lead')
@UseGuards(JwtAuthGuard)
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get()
  async getLeads(@Query() filters: LeadFilterDto) {
    try {
      return await this.leadService.getLeads(filters);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getLeadById(@Param('id') id: string) {
    try {
      return await this.leadService.getLeadById(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createLead(@Body() leadData: {
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
  }) {
    try {
      return await this.leadService.createLead(leadData);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateLead(
    @Param('id') id: string,
    @Body() leadData: Partial<Lead>,
  ) {
    try {
      return await this.leadService.updateLead(id, leadData);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteLead(@Param('id') id: string) {
    try {
      return await this.leadService.deleteLead(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
