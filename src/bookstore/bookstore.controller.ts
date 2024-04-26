import { Controller } from '@nestjs/common';
import { BookstoreService } from './bookstore.service';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { RoleGuard } from '../auth/guards/role.guard';
import { Post, Get, Body, Param } from '@nestjs/common';
import { CreateBookstoreDto } from './dto/create-bookstore.dto';

@Controller('bookstore')
export class BookstoreController {
  constructor(private readonly bookstoreService: BookstoreService) {}

  @Post('/create')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createBookstore(@Body() createBookstoreDto: CreateBookstoreDto) {
    return await this.bookstoreService.createBookstore(createBookstoreDto);
  }

  @Get('/all-stores')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAllStores() {
    return await this.bookstoreService.getAllStores();
  }

  @Get('/:id')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getBooksByStoreId(@Param('id') id: string) {
    return await this.bookstoreService.getBooksByStoreId(id);
  }

  @Post('/:storeId/add-book/:bookId')
  @Roles(Role.STORE_MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async addBookToStore(
    @Param('bookId') bookId: string,
    @Param('storeId') storeId: string,
    @Body('quantity') quantity: number,
  ) {
    return await this.bookstoreService.addBookToStore(
      bookId,
      storeId,
      quantity,
    );
  }

  @Post('/:storeId/remove-book/:bookId')
  @Roles(Role.STORE_MANAGER, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async removeBookFromStore(
    @Param('bookId') bookId: string,
    @Param('storeId') storeId: string,
    @Body('quantity') quantity: number,
  ) {
    return await this.bookstoreService.removeBookFromStore(
      bookId,
      storeId,
      quantity,
    );
  }
}
