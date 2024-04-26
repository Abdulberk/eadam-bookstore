import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { JwtService } from '@nestjs/jwt';
import { AccessModule } from '@app/common/access-control/access-control.module';
import { RedisModule } from '@app/common/redis/redis.module';
@Module({
  imports: [AccessModule, RedisModule],
  providers: [BookService, JwtService],
  controllers: [BookController],
  exports: [BookService],
})
export class BookModule {}
