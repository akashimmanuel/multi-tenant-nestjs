import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum LeadType {
  SUPPORT = 'Support',
  SALES = 'Sales',
  CONSULTATION = 'Consultation',
}

export enum LeadStatus {
  OPEN = 'Open',
  CONVERTED = 'Converted',
  REJECTED = 'Rejected',
  DISCARDED = 'Discarded'
}

export enum LeadProgress {
  NEW_LEAD_ENTRY = 'New Lead Entry',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  PROPOSAL_SENT = 'Proposal Sent',
  NEGOTIATION = 'Negotiation',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost',
}

@Schema({ timestamps: true })
export class Lead extends Document {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  mobileNo: string;

  @Prop({ trim: true, default: '' })
  landlineNo: string;

  @Prop({ required: true, trim: true })
  province: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ required: true, enum: LeadType, default: LeadType.SUPPORT })
  leadType: LeadType;

  @Prop({ required: true, enum: LeadStatus, default: LeadStatus.OPEN })
  leadStatus: LeadStatus;

  @Prop({ required: true, enum: LeadProgress, default: LeadProgress.NEW_LEAD_ENTRY })
  leadProgress: LeadProgress;

  @Prop({ trim: true, default: '' })
  allocatorRemarks: string;

  @Prop({ trim: true, default: '' })
  userRemarks: string;

  @Prop({ type: Date, default: null })
  appointmentDate: Date | null;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);

// Add indexes
LeadSchema.index({ leadStatus: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ email: 1 }, { unique: true });
LeadSchema.index({ mobileNo: 1 }, { unique: true });
