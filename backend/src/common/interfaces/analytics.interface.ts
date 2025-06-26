export interface AnalyticsEvent {
  id: string;
  timestamp: Date;
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  ip: string | null;
  userId: string | null;
  userAgent: string;
}

export interface AnalyticsResponse {
  totalRequests: number;
  averageResponseTime: number;
  topEndpoints: Array<{ path: string; _count: { path: number } }>;
  uniqueAuthenticatedUsers: number;
}

export interface MethodStatsResponse {
  method: string;
  _count: { method: number };
}

export interface StatusStatsResponse {
  statusCode: number;
  _count: { statusCode: number };
}

export interface TimeRangeResponse {
  id: string;
  timestamp: Date;
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  ip: string | null;
  userId: string | null;
  userAgent: string;
}
