import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, HttpException } from '@nestjs/common';
import { DonationController } from './donation.controller';
import { DonationService } from 'src/application/core/service/donation.service';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { BloodType, DonationStatus } from 'src/application/core/domain/donation.entity';

const mockDonation = {
  id: 'donation-1',
  userId: 'user-1',
  name: 'Test Donor',
  phone: '11999999999',
  bloodType: BloodType.A_POSITIVE,
  status: DonationStatus.PENDING,
  content: 'Test content',
  startDate: new Date().toISOString(),
  finishDate: new Date().toISOString(),
  location: { latitude: -23.5, longitude: -46.6 },
  description: '',
  image: '',
};

const mockDonationService = {
  findAllDonations: jest.fn(),
  findDonationById: jest.fn(),
  findDonationsByBloodType: jest.fn(),
  countDonations: jest.fn(),
  createDonation: jest.fn(),
  updateStatus: jest.fn(),
  deleteDonation: jest.fn(),
  deleteDonationsByUserId: jest.fn(),
};

// Helper to create a mock request with user
const mockRequest = (userId: string) => ({
  user: { userId, email: 'test@test.com', personType: 'DONOR' },
});

describe('DonationController', () => {
  let controller: DonationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonationController],
      providers: [{ provide: DonationService, useValue: mockDonationService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DonationController>(DonationController);
    jest.clearAllMocks();
  });

  describe('GET /donations/count (public)', () => {
    it('should return count without authentication', async () => {
      mockDonationService.countDonations.mockResolvedValue({ isSuccess: true, value: 42 });
      const result = await controller.countDonations();
      expect(result).toEqual({ count: 42 });
    });

    it('should throw 400 on service error', async () => {
      mockDonationService.countDonations.mockResolvedValue({ isSuccess: false, error: 'DB error' });
      await expect(controller.countDonations()).rejects.toThrow(HttpException);
    });
  });

  describe('GET /donations/blood-type/:bloodType (protected)', () => {
    it('should return donations for blood type when authenticated', async () => {
      mockDonationService.findDonationsByBloodType.mockResolvedValue({ isSuccess: true, value: [mockDonation] });
      const result = await controller.findByBloodType(BloodType.A_POSITIVE);
      expect(result).toEqual([mockDonation]);
      expect(mockDonationService.findDonationsByBloodType).toHaveBeenCalledWith(BloodType.A_POSITIVE);
    });

    it('should throw 404 when no donations found', async () => {
      mockDonationService.findDonationsByBloodType.mockResolvedValue({ isSuccess: false, error: 'DonationNotFound' });
      await expect(controller.findByBloodType(BloodType.A_POSITIVE)).rejects.toThrow(HttpException);
    });
  });

  describe('GET /donations/:id (protected)', () => {
    it('should return donation by id when authenticated', async () => {
      mockDonationService.findDonationById.mockResolvedValue({ isSuccess: true, value: mockDonation });
      const result = await controller.findDonationById('donation-1');
      expect(result).toEqual(mockDonation);
    });

    it('should throw 404 when donation not found', async () => {
      mockDonationService.findDonationById.mockResolvedValue({ isSuccess: false, error: 'DonationNotFound' });
      await expect(controller.findDonationById('bad-id')).rejects.toThrow(HttpException);
    });
  });

  describe('GET /donations (protected)', () => {
    it('should return paginated donations when authenticated', async () => {
      const paginated = { donations: [mockDonation], total: 1, page: 1, limit: 10 };
      mockDonationService.findAllDonations.mockResolvedValue({ isSuccess: true, value: paginated });
      const result = await controller.findAllDonations('1', '10');
      expect(result).toEqual(paginated);
      expect(mockDonationService.findAllDonations).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });

    it('should throw 400 for invalid page', async () => {
      await expect(controller.findAllDonations('0', '10')).rejects.toThrow(HttpException);
    });

    it('should throw 400 for limit over 100', async () => {
      await expect(controller.findAllDonations('1', '101')).rejects.toThrow(HttpException);
    });
  });

  describe('DELETE /donations/user/:userId (protected + ownership)', () => {
    it('should delete donations when userId matches authenticated user', async () => {
      mockDonationService.deleteDonationsByUserId.mockResolvedValue({ isSuccess: true, value: { deletedCount: 3 } });
      const req = mockRequest('user-1') as any;
      const result = await controller.deleteDonationsByUserId('user-1', req);
      expect(result).toEqual({
        message: 'Successfully deleted 3 donation(s) for user user-1',
        deletedCount: 3,
      });
    });

    it('should throw 403 when userId does not match authenticated user', async () => {
      const req = mockRequest('user-2') as any;
      await expect(
        controller.deleteDonationsByUserId('user-1', req),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw 400 on service error', async () => {
      mockDonationService.deleteDonationsByUserId.mockResolvedValue({ isSuccess: false, error: 'DB error' });
      const req = mockRequest('user-1') as any;
      await expect(
        controller.deleteDonationsByUserId('user-1', req),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('DELETE /donations/:id (protected)', () => {
    it('should delete donation by id when authenticated', async () => {
      mockDonationService.deleteDonation.mockResolvedValue({ isSuccess: true });
      const result = await controller.deleteDonation('donation-1');
      expect(result).toEqual({ message: 'Donation deleted successfully' });
    });

    it('should throw 404 when donation not found', async () => {
      mockDonationService.deleteDonation.mockResolvedValue({ isSuccess: false, error: 'DonationNotFound' });
      await expect(controller.deleteDonation('bad-id')).rejects.toThrow(HttpException);
    });
  });
});
