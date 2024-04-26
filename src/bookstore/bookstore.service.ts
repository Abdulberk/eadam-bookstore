import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBookstoreDto } from './dto/create-bookstore.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma, Store } from '@prisma/client';
import { BookService } from '../book/book.service';
import { NotFoundException } from '@nestjs/common';
import { RedisService } from '@app/common/redis/redis.service';

@Injectable()
export class BookstoreService {
  constructor(
    private databaseService: DatabaseService,
    private bookService: BookService,
    private redisService: RedisService,
  ) {}
  async createBookstore(
    createBookstoreDto: CreateBookstoreDto,
  ): Promise<Partial<Store>> {
    try {
      const newBookstore = await this.databaseService.store.create({
        data: {
          ...createBookstoreDto,
        } as Prisma.StoreCreateInput,
      });

      await this.redisService.setStore(newBookstore.id, newBookstore, 60);
      return newBookstore;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllStores(): Promise<Store[]> {
    try {
      const allStores = await this.databaseService.store.findMany();
      return allStores;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getBooksByStoreId(storeId: string): Promise<Store> {
    try {
      const store = await this.databaseService.store.findUnique({
        where: {
          id: storeId,
        },
        include: {
          books: true,
        },
      });
      return store;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getStoreById(storeId: string): Promise<Store> {
    try {
      const cachedStore = await this.redisService.getStore(storeId);
      if (cachedStore) {
        return JSON.parse(cachedStore);
      }
      const store = await this.databaseService.store.findUnique({
        where: {
          id: storeId,
        },
      });

      if (store) {
        await this.redisService.setStore(storeId, store, 60);
      }

      return store;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async addBookToStore(bookId: string, storeId: string, quantity: number) {
    try {
      const store = await this.getStoreById(storeId);
      if (!store) {
        throw new NotFoundException('Store not found');
      }

      const book = await this.bookService.getBookById(bookId);
      if (!book) {
        throw new NotFoundException('Book not found');
      }

      return await this.databaseService.store.update({
        where: {
          id: storeId,
        },
        data: {
          books: {
            update: {
              where: {
                id: bookId,
              },
              data: {
                quantity: {
                  increment: quantity,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeBookFromStore(bookId: string, storeId: string, quantity: number) {
    try {
      const store = await this.getStoreById(storeId);
      if (!store) {
        throw new NotFoundException('Store not found');
      }

      const book = await this.bookService.getBookById(bookId);
      if (!book) {
        throw new NotFoundException('Book not found');
      }

      return await this.databaseService.store.update({
        where: {
          id: storeId,
        },
        data: {
          books: {
            update: {
              where: {
                id: bookId,
              },
              data: {
                quantity: {
                  decrement: quantity,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
