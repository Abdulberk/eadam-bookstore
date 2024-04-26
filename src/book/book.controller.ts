import { Controller } from '@nestjs/common';
import { BookService } from './book.service';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { RoleGuard } from '../auth/guards/role.guard';
import { Post, Get, Body, Param } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('/create')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async createBook(@Body() createBookDto: CreateBookDto) {
    return await this.bookService.createBook(createBookDto);
  }

  @Get('/all')
  async getAllBooks() {
    return await this.bookService.getAllBooks();
  }

  @Get('/:id')
  async getBookById(@Param('id') id: string) {
    return await this.bookService.getBookById(id);
  }

  @Get(':bookId/stores')
  async getStoresByBookId(@Param('bookId') bookId: string) {
    return await this.bookService.getStoresByBookId(bookId);
  }
}
