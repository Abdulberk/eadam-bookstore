import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, LoggerModule } from '@app/common';
import { AccessControlService } from '@app/common/access-control/access-control.service';
import { HealthModule } from './health/health.module';
import { BookModule } from './book/book.module';
import { BookstoreService } from './bookstore/bookstore.service';
import { BookstoreModule } from './bookstore/bookstore.module';
import { RedisModule } from '@app/common/redis/redis.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    ConfigModule,
    LoggerModule,
    HealthModule,
    BookModule,
    BookstoreModule,
    RedisModule,
  ],
  controllers: [],
  providers: [AccessControlService, BookstoreService],
})
export class AppModule {}
