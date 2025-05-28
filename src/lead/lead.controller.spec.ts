import { Test, TestingModule } from '@nestjs/testing';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LeadFilterDto } from './dto/lead-filter.dto';

describe('LeadController', () => {
  let controller: LeadController;
  let service: LeadService;

  const mockLeadService = {
    getLeads: jest.fn(),
    getLeadById: jest.fn(),
    createLead: jest.fn(),
    updateLead: jest.fn(),
    deleteLead: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadController],
      providers: [
        {
          provide: LeadService,
          useValue: mockLeadService,
        },
      ],
    }).compile();

    controller = module.get<LeadController>(LeadController);
    service = module.get<LeadService>(LeadService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLeads', () => {
    it('should return an array of leads', async () => {
      const mockLeads = [
        {
          _id: 'lead-id-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          mobileNo: '1234567890',
          province: 'Test Province',
          city: 'Test City',
          leadType: 'Hot',
          leadStatus: 'New',
          leadProgress: 'Initial Contact',
        },
      ];
      mockLeadService.getLeads.mockResolvedValue(mockLeads);

      const filters: LeadFilterDto = {};
      expect(await controller.getLeads(filters)).toBe(mockLeads);
      expect(mockLeadService.getLeads).toHaveBeenCalledWith(filters);
    });

    it('should handle errors', async () => {
      mockLeadService.getLeads.mockRejectedValue(new Error('Failed to fetch leads'));

      try {
        await controller.getLeads({});
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
