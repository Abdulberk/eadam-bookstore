import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisPrefixEnum } from './enums/redis-predix.enum';

@Injectable()
export class RedisRepository {
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

  async setWithExpiry(
    prefix: RedisPrefixEnum,
    key: string,
    value: string,
    expirySec: number,
  ): Promise<void> {
    await this.redisClient.hset(prefix, key, value);
    if (expirySec) {
      await this.redisClient.expire(prefix, expirySec);
    }
  }

  async get(prefix: RedisPrefixEnum, key: string): Promise<string | null> {
    return this.redisClient.hget(prefix, key);
  }

  async delete(prefix: RedisPrefixEnum, key: string): Promise<void> {
    await this.redisClient.hdel(prefix, key);
  }
}
