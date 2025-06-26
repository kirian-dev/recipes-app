import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnalyticsEventDto } from './dto/create-analytics-event.dto';
import { AnalyticsLoggerService } from './services/analytics-logger.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  const mockPrismaService = {
    analyticsEvent: {
      create: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
    },
  };

  const mockAnalyticsLoggerService = {
    logEventCreation: jest.fn(),
    logAnalyticsRetrieval: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: AnalyticsLoggerService,
          useValue: mockAnalyticsLoggerService,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    it('should create an analytics event successfully', async () => {
      const createEventDto: CreateAnalyticsEventDto = {
        method: 'GET',
        path: '/recipes',
        statusCode: 200,
        duration: 150,
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        userId: 'user-id',
        timestamp: '2024-01-01T12:00:00.000Z',
      };

      const expectedEvent = {
        id: 'event-id',
        ...createEventDto,
        timestamp: new Date(createEventDto.timestamp),
      };

      mockPrismaService.analyticsEvent.create.mockResolvedValue(expectedEvent);

      const result = await service.createEvent(createEventDto);

      expect(mockPrismaService.analyticsEvent.create).toHaveBeenCalledWith({
        data: createEventDto,
      });
      expect(result).toEqual(expectedEvent);
    });

    it('should handle creation without userId', async () => {
      const createEventDto: CreateAnalyticsEventDto = {
        method: 'GET',
        path: '/recipes',
        statusCode: 200,
        duration: 150,
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        timestamp: '2024-01-01T12:00:00.000Z',
      };

      const expectedEvent = {
        id: 'event-id',
        ...createEventDto,
        userId: null,
        timestamp: new Date(createEventDto.timestamp),
      };

      mockPrismaService.analyticsEvent.create.mockResolvedValue(expectedEvent);

      const result = await service.createEvent(createEventDto);

      expect(result).toEqual(expectedEvent);
    });
  });

  describe('getRequestsByMethod', () => {
    it('should return method statistics', async () => {
      const mockStats = [
        { method: 'GET', _count: { method: 100 } },
        { method: 'POST', _count: { method: 50 } },
        { method: 'PUT', _count: { method: 25 } },
      ];

      mockPrismaService.analyticsEvent.groupBy.mockResolvedValue(mockStats);

      const result = await service.getRequestsByMethod();

      expect(mockPrismaService.analyticsEvent.groupBy).toHaveBeenCalledWith({
        by: ['method'],
        _count: { method: true },
        orderBy: { _count: { method: 'desc' } },
      });
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

      mockPrismaService.analyticsEvent.groupBy.mockResolvedValue(mockStats);

      const result = await service.getRequestsByStatus();

      expect(mockPrismaService.analyticsEvent.groupBy).toHaveBeenCalledWith({
        by: ['statusCode'],
        _count: { statusCode: true },
        orderBy: { statusCode: 'asc' },
      });
      expect(result).toEqual(mockStats);
    });
  });

  describe('getAnalytics', () => {
    it('should return analytics overview', async () => {
      const mockTotalRequests = 1000;
      const mockAverageResponseTime = { _avg: { duration: 150.5 } };
      const mockTopEndpoints = [
        { path: '/recipes', _count: { path: 100 } },
        { path: '/auth/login', _count: { path: 50 } },
      ];
      const mockUniqueUsers = [
        { userId: 'user-1', _count: { userId: 50 } },
        { userId: 'user-2', _count: { userId: 30 } },
      ];

      mockPrismaService.analyticsEvent.count.mockResolvedValue(
        mockTotalRequests,
      );
      mockPrismaService.analyticsEvent.aggregate.mockResolvedValue(
        mockAverageResponseTime,
      );
      mockPrismaService.analyticsEvent.groupBy
        .mockResolvedValueOnce(mockTopEndpoints)
        .mockResolvedValueOnce(mockUniqueUsers);

      const result = await service.getAnalytics();

      expect(result).toEqual({
        totalRequests: mockTotalRequests,
        averageResponseTime: 150.5,
        topEndpoints: mockTopEndpoints,
        uniqueAuthenticatedUsers: 2,
      });
    });
  });

  describe('getRequestsByTimeRange', () => {
    it('should return events within date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

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

      mockPrismaService.analyticsEvent.findMany.mockResolvedValue(mockEvents);

      const result = await service.getRequestsByTimeRange(startDate, endDate);

      expect(mockPrismaService.analyticsEvent.findMany).toHaveBeenCalledWith({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { timestamp: 'desc' },
      });
      expect(result).toEqual([
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
      ]);
    });
  });

  describe('logEvent', () => {
    it('should log event successfully', async () => {
      const eventData = {
        method: 'GET',
        path: '/recipes',
        statusCode: 200,
        duration: 150,
        ip: '127.0.0.1',
        userId: 'user-1',
        userAgent: 'Mozilla/5.0',
        timestamp: new Date('2024-01-01T12:00:00.000Z'),
      };

      const expectedEvent = {
        id: 'event-id',
        ...eventData,
        timestamp: eventData.timestamp,
      };

      mockPrismaService.analyticsEvent.create.mockResolvedValue(expectedEvent);

      await service.logEvent(eventData);

      expect(mockPrismaService.analyticsEvent.create).toHaveBeenCalledWith({
        data: {
          method: eventData.method,
          path: eventData.path,
          statusCode: eventData.statusCode,
          duration: eventData.duration,
          ip: eventData.ip,
          userId: eventData.userId,
          userAgent: eventData.userAgent,
          timestamp: eventData.timestamp.toISOString(),
        },
      });
    });
  });
});
