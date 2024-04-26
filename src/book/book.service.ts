import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
import { Book } from '@prisma/client';
import { InternalServerErrorException } from '@nestjs/common';
import { RedisService } from '@app/common/redis/redis.service';

@Injectable()
export class BookService {
  constructor(
    private databaseService: DatabaseService,
    private redisService: RedisService,
  ) {}
  async createBook(createBookDto: CreateBookDto): Promise<Partial<Book>> {
    try {
      const { stores, ...rest } = createBookDto;
      const newBook = await this.databaseService.book.create({
        data: {
          ...rest,
          stores: {
            connect: stores.map((id) => ({ id })),
          },
        } as Prisma.BookCreateInput,
      });

      await this.redisService.setBook(newBook.id, newBook, 60);
      return newBook;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllBooks(): Promise<Book[]> {
    try {
      const allBooks = await this.databaseService.book.findMany({
        include: {
          stores: true,
        },
      });
      return allBooks;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getStoresByBookId(bookId: string) {
    try {
      return this.databaseService.book.findUnique({
        where: { id: bookId },
        include: { stores: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getBookById(id: string): Promise<Book> {
    try {
      const cachedBook = await this.redisService.getBook(id);

      if (cachedBook) {
        return JSON.parse(cachedBook);
      }

      const book = await this.databaseService.book.findUnique({
        where: {
          id: id,
        },
      });

      if (book) {
        await this.redisService.setBook(id, book, 60);
      }

      return book;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
