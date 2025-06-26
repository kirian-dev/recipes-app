import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttleConfig: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    },
    {
      ttl: 3600000, // 1 hour
      limit: 1000, // 1000 requests per hour
    },
  ],
  ignoreUserAgents: [
    // Ignore health check requests
    /health/i,
    // Ignore monitoring requests
    /metrics/i,
  ],
};
