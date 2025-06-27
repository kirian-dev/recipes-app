import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsLoggerService } from './services/analytics-logger.service';
import { Request, Response } from 'express';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;

  const mockAnalyticsService = {
    getAnalytics: jest.fn(),
    getRequestsByMethod: jest.fn(),
    getRequestsByStatus: jest.fn(),
    getRequestsByTimeRange: jest.fn(),
  };

  const mockAnalyticsLoggerService = {
    logEndpointAccess: jest.fn(),
  };

  const mockRequest = {
    method: 'GET',
    path: '/analytics',
    ip: '127.0.0.1',
  } as Request;

  const mockResponse = {
    statusCode: 200,
  } as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
        {
          provide: AnalyticsLoggerService,
          useValue: mockAnalyticsLoggerService,
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAnalytics', () => {
    it('should return analytics overview', async () => {
      const mockAnalytics = {
        totalRequests: 1000,
        averageResponseTime: 150.5,
        topEndpoints: [
          { path: '/recipes', _count: { path: 100 } },
          { path: '/auth/login', _count: { path: 50 } },
        ],
        uniqueAuthenticatedUsers: 25,
      };

      mockAnalyticsService.getAnalytics.mockResolvedValue(mockAnalytics);

      const result = await controller.getAnalytics(mockRequest, mockResponse);

      expect(mockAnalyticsService.getAnalytics).toHaveBeenCalled();
      expect(result).toEqual(mockAnalytics);
    });
  });

  describe('getRequestsByMethod', () => {
    it('should return method statistics', async () => {
      const mockStats = [
        { method: 'GET', _count: { method: 100 } },
        { method: 'POST', _count: { method: 50 } },
        { method: 'PUT', _count: { method: 25 } },
      ];

      mockAnalyticsService.getRequestsByMethod.mockResolvedValue(mockStats);

      const result = await controller.getRequestsByMethod(mockRequest, mockResponse);

      expect(mockAnalyticsService.getRequestsByMethod).toHaveBeenCalled();
      expect(result).toEqual(mockStats);
    });
  });

  describe('getRequestsByStatus', () => {
    it('should return status code statistics', async () => {
      const mockStats = [
        { statusCode: 200, _count: { statusCode: 150 } },
        { statusCode: 404, _count: { statusCode: 20 } },
        { statusCode: 500, _count: { statusCode: 5 } },
      ];

      mockAnalyticsService.getRequestsByStatus.mockResolvedValue(mockStats);

      const result = await controller.getRequestsByStatus(mockRequest, mockResponse);

      expect(mockAnalyticsService.getRequestsByStatus).toHaveBeenCalled();
      expect(result).toEqual(mockStats);
    });
  });

  describe('getRequestsByTimeRange', () => {
    it('should return events within date range', async () => {
      const startDate = '2024-01-01T00:00:00.000Z';
      const endDate = '2024-01-31T23:59:59.999Z';
      const mockEvents = [
        {
          id: 'event-1',
          method: 'GET',
          path: '/recipes',
          statusCode: 200,
          duration: 150,
          ip: '127.0.0.1',
          userId: 'user-1',
          userAgent: 'Mozilla/5.0',
          timestamp: new Date('2024-01-15'),
        },
      ];

      mockAnalyticsService.getRequestsByTimeRange.mockResolvedValue(mockEvents);

      const result = await controller.getRequestsByTimeRange(startDate, endDate, mockRequest, mockResponse);

      expect(mockAnalyticsService.getRequestsByTimeRange).toHaveBeenCalledWith(new Date(startDate), new Date(endDate));
      expect(result).toEqual(mockEvents);
    });
  });
});
