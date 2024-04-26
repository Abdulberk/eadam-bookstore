import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { redisClientFactory } from './redis.provider';
import { RedisRepository } from './redis.repository';

@Module({
  providers: [RedisService, redisClientFactory, RedisRepository],
  exports: [RedisService, RedisRepository],
})
export class RedisModule {}
