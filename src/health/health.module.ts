import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaClient } from '@prisma/client';
import { PrismaHealthIndicator } from '@nestjs/terminus';

@Module({
  imports: [
    TerminusModule.forRoot({
      errorLogStyle: 'pretty',
    }),
  ],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator, PrismaClient],
})
export class HealthModule {}
