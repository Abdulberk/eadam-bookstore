import { Inject, Injectable } from '@nestjs/common';
import { RedisPrefixEnum } from './enums/redis-predix.enum';
import { Prisma } from '@prisma/client';
import { RedisRepository } from './redis.repository';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
  ) {}

  async setBook(
    bookId: string,
    bookData: Prisma.BookCreateInput,
    expirySec: number,
  ): Promise<void> {
    try {
      const serializedData = JSON.stringify(bookData);
      await this.redisRepository.setWithExpiry(
        RedisPrefixEnum.BOOK,
        bookId,
        serializedData,
        expirySec,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getBook(bookId: string): Promise<string | null> {
    try {
      return this.redisRepository.get(RedisPrefixEnum.BOOK, bookId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteBook(bookId: string): Promise<void> {
    try {
      await this.redisRepository.delete(RedisPrefixEnum.BOOK, bookId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async setStore(
    storeId: string,
    storeData: Prisma.StoreCreateInput,
    expirySec: number,
  ): Promise<void> {
    try {
      const serializedData = JSON.stringify(storeData);
      await this.redisRepository.setWithExpiry(
        RedisPrefixEnum.STORE,
        storeId,
        serializedData,
        expirySec,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getStore(storeId: string): Promise<string | null> {
    try {
      return this.redisRepository.get(RedisPrefixEnum.STORE, storeId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteStore(storeId: string): Promise<void> {
    try {
      await this.redisRepository.delete(RedisPrefixEnum.STORE, storeId);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
