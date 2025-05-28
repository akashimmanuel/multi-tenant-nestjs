import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { LeadStatus, LeadType, LeadProgress } from '../lead.schema';

export class LeadFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(LeadStatus)
  leadStatus?: LeadStatus;

  @IsOptional()
  @IsEnum(LeadType)
  leadType?: LeadType;

  @IsOptional()
  @IsEnum(LeadProgress)
  leadProgress?: LeadProgress;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
} 