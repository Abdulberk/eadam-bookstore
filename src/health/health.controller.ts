import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaClient } from '@prisma/client';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaHealthIndicator,
    private prismaClient: PrismaClient,
    private config: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () =>
        this.prisma.pingCheck('database', this.prismaClient, {
          timeout: this.config.get('DB_HEALTH_CHECK_TIMEOUT'),
        }),
      async () => ({ server: 'up' }),
    ]);
  }
}
