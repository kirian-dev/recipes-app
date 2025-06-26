import { SetMetadata } from '@nestjs/common';

export const THROTTLE_KEY = 'throttle';
export const Throttle = (limit: number, ttl: number) =>
  SetMetadata(THROTTLE_KEY, { limit, ttl });

// Predefined throttle decorators for common use cases
export const ThrottleStrict = () => Throttle(10, 60000); // 10 requests per minute
export const ThrottleModerate = () => Throttle(30, 60000); // 30 requests per minute
export const ThrottleLoose = () => Throttle(100, 60000); // 100 requests per minute
