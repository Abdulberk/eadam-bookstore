import { Module } from '@nestjs/common';
import { BookstoreController } from './bookstore.controller';
import { BookstoreService } from './bookstore.service';
import { JwtService } from '@nestjs/jwt';
import { AccessModule } from '@app/common/access-control/access-control.module';
import { BookService } from 'src/book/book.service';
import { RedisModule } from '@app/common/redis/redis.module';

@Module({
  imports: [AccessModule, RedisModule],
  controllers: [BookstoreController],
  providers: [BookstoreService, JwtService, BookService],
  exports: [BookstoreService],
})
export class BookstoreModule {}
